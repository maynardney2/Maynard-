# CyberShield LMS — Deployment Guide

**Classification:** Internal — Confidential  
**Version:** 1.0  
**Last Updated:** May 2026  
**Audience:** DevOps Engineers, System Administrators

---

## Prerequisites

Before beginning deployment, ensure the following are available:

### Accounts and Subscriptions
- Active **Microsoft Azure Subscription** with Contributor or Owner role on the target resource group
- **Microsoft 365 Business Premium or Enterprise** tenant with Global Admin or Application Admin access
- **Azure AD tenant** (same tenant as M365, or a federated external tenant)
- **GitHub repository** access for the CyberShield codebase (or equivalent source control)

### Local Development Tools
- **Node.js 20 LTS** (download from nodejs.org — verify with `node --version`)
- **npm 10+** (bundled with Node.js 20)
- **Git 2.40+**
- **Azure CLI 2.55+** (install: `curl -sL https://aka.ms/InstallAzureCLIDeb | sudo bash`)
- **PostgreSQL client tools** (`psql` version 15+)
- A code editor such as **Visual Studio Code**

### Infrastructure Requirements
- Azure resource group created for CyberShield (e.g., `rg-cybershield-prod`)
- Custom domain name registered and DNS managed (e.g., `cybershield.yourcompany.com`)
- SSL/TLS certificate (or use Azure-managed certificate — recommended)

---

## Step 1: Azure AD App Registration

Azure AD App Registration enables CyberShield to authenticate users via Microsoft SSO.

**1.1 Navigate to Azure Active Directory**

In the Azure Portal (portal.azure.com), navigate to:
`Azure Active Directory → App registrations → New registration`

**Screenshot area:** The App registrations blade shows a list of existing registrations with a "+ New registration" button at the top.

**1.2 Create the App Registration**

Fill in the following fields:
- **Name:** `CyberShield LMS`
- **Supported account types:** `Accounts in this organizational directory only (Single tenant)`
- **Redirect URI:** Select `Single-page application (SPA)` from the dropdown, then enter:
  - Production: `https://cybershield.yourcompany.com/auth/callback`
  - Development: `http://localhost:5173/auth/callback`
- Click **Register**

**Screenshot area:** After registration, you land on the app's Overview page showing the **Application (client) ID** and **Directory (tenant) ID**. Copy both values — you will need them in your `.env` configuration.

**1.3 Configure API Permissions**

Navigate to: `App registration → API permissions → Add a permission`

Add the following **Microsoft Graph** delegated permissions:
- `User.Read` (sign in and read user profile)
- `User.ReadBasic.All` (read all users' basic profiles — for department sync)
- `Group.Read.All` (read all groups — for role mapping)

Then add the following **Microsoft Graph** application permissions (for background sync job):
- `User.Read.All`
- `Group.Read.All`

Click **Grant admin consent for [Your Organization]**. The status indicators should show green checkmarks.

**Screenshot area:** The API permissions list with all permissions showing "Granted for [Org]" status.

**1.4 Create Client Secret**

Navigate to: `App registration → Certificates & secrets → Client secrets → New client secret`

- **Description:** `CyberShield Production`
- **Expires:** 24 months (set a reminder to rotate before expiry)
- Click **Add**

**IMPORTANT:** Copy the **Value** immediately. It will not be shown again after you navigate away. Store it in your organization's secrets vault.

**1.5 Configure Token Configuration (Optional — Recommended)**

Navigate to: `App registration → Token configuration → Add optional claim`
- Token type: **ID**
- Claims to add: `email`, `given_name`, `family_name`, `department`, `jobTitle`

This ensures user profile information is included in the ID token for automatic profile population on first login.

---

## Step 2: Azure Resource Provisioning

**2.1 Login to Azure CLI**

```bash
az login
az account set --subscription "Your Subscription Name"
```

**2.2 Create Resource Group (if not already created)**

```bash
az group create \
  --name rg-cybershield-prod \
  --location southeastasia
```

**2.3 Create PostgreSQL Flexible Server**

```bash
az postgres flexible-server create \
  --resource-group rg-cybershield-prod \
  --name cybershield-db-prod \
  --location southeastasia \
  --admin-user cybershieldadmin \
  --admin-password "YourSecurePassword123!" \
  --sku-name Standard_D4s_v3 \
  --tier GeneralPurpose \
  --storage-size 128 \
  --version 15 \
  --high-availability ZoneRedundant \
  --zone 1 \
  --standby-zone 2
```

**2.4 Create App Service Plan and App Service**

```bash
# Create App Service Plan (P2v3 = 2 vCores, 8GB RAM)
az appservice plan create \
  --name asp-cybershield-prod \
  --resource-group rg-cybershield-prod \
  --sku P2v3 \
  --is-linux

# Create the Web App for the backend API
az webapp create \
  --resource-group rg-cybershield-prod \
  --plan asp-cybershield-prod \
  --name cybershield-api-prod \
  --runtime "NODE:20-lts"
```

**2.5 Create Azure Cache for Redis**

```bash
az redis create \
  --resource-group rg-cybershield-prod \
  --name cybershield-cache-prod \
  --sku Standard \
  --vm-size c1 \
  --location southeastasia
```

---

## Step 3: Database Setup

**3.1 Allow Your IP for Initial Setup**

In the Azure Portal, navigate to your PostgreSQL Flexible Server:
`Networking → Firewall rules → Add current client IP address`

This temporarily allows your machine to connect for schema and seed data loading. Remove this rule after setup is complete.

**3.2 Create the Application Database**

```bash
psql -h cybershield-db-prod.postgres.database.azure.com \
     -U cybershieldadmin \
     -c "CREATE DATABASE cybershield_prod;"

psql -h cybershield-db-prod.postgres.database.azure.com \
     -U cybershieldadmin \
     -c "CREATE USER cybershield_app WITH PASSWORD 'AppUserPassword123!';"

psql -h cybershield-db-prod.postgres.database.azure.com \
     -U cybershieldadmin \
     -c "GRANT ALL PRIVILEGES ON DATABASE cybershield_prod TO cybershield_app;"
```

**3.3 Run the Database Schema**

```bash
psql -h cybershield-db-prod.postgres.database.azure.com \
     -U cybershieldadmin \
     -d cybershield_prod \
     -f database/schema.sql
```

Expected output: A series of `CREATE TABLE`, `CREATE INDEX`, and `CREATE TRIGGER` messages confirming all database objects were created.

**3.4 Run the Seed Data**

```bash
psql -h cybershield-db-prod.postgres.database.azure.com \
     -U cybershieldadmin \
     -d cybershield_prod \
     -f database/seed.sql
```

Seed data includes the initial admin user, default course catalog entries, default badge definitions, and default policy templates. Verify with:

```bash
psql -h cybershield-db-prod.postgres.database.azure.com \
     -U cybershieldadmin \
     -d cybershield_prod \
     -c "SELECT COUNT(*) FROM users; SELECT COUNT(*) FROM courses; SELECT COUNT(*) FROM badges;"
```

**3.5 Remove Temporary Firewall Rule**

After database setup, remove the firewall rule that allowed your IP. Going forward, the application will connect via the Private Endpoint (see Step 7).

---

## Step 4: Backend Deployment

**4.1 Clone the Repository**

```bash
git clone https://github.com/yourorg/cybershield-lms.git
cd cybershield-lms/backend
npm install
```

**4.2 Configure the Environment File**

Copy the sample environment file and configure all values:

```bash
cp .env.example .env
```

Edit `.env` with the following values:

```env
# Application
NODE_ENV=production
PORT=8080
APP_URL=https://cybershield.yourcompany.com

# Database
DATABASE_URL=postgresql://cybershield_app:AppUserPassword123!@cybershield-db-prod.postgres.database.azure.com:5432/cybershield_prod?sslmode=require

# Redis
REDIS_URL=rediss://cybershield-cache-prod.redis.cache.windows.net:6380

# Azure AD / Authentication
AZURE_TENANT_ID=your-tenant-id-from-step-1
AZURE_CLIENT_ID=your-client-id-from-step-1
AZURE_CLIENT_SECRET=your-client-secret-from-step-1
JWT_SECRET=generate-a-strong-random-256-bit-secret-here
JWT_EXPIRES_IN=1h
REFRESH_TOKEN_EXPIRES_IN=7d

# Microsoft Graph (for user sync)
GRAPH_API_SCOPE=https://graph.microsoft.com/.default

# Email (Exchange Online SMTP Relay)
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=no-reply@yourcompany.com
SMTP_PASS=your-smtp-password
EMAIL_FROM=CyberShield LMS <no-reply@yourcompany.com>

# Teams Webhook (optional)
TEAMS_WEBHOOK_URL=https://yourcompany.webhook.office.com/webhookb2/...

# Application Insights
APPINSIGHTS_CONNECTION_STRING=InstrumentationKey=...

# Frontend URL (for CORS)
FRONTEND_URL=https://cybershield.yourcompany.com
```

**4.3 Build TypeScript**

```bash
npm run build
```

This compiles the TypeScript source to JavaScript in the `dist/` directory. Verify the build completes without errors.

**4.4 Deploy to Azure App Service**

```bash
# Zip the production files
zip -r deploy.zip dist/ node_modules/ package.json

# Deploy via Azure CLI
az webapp deployment source config-zip \
  --resource-group rg-cybershield-prod \
  --name cybershield-api-prod \
  --src deploy.zip
```

Alternatively, set up continuous deployment from GitHub Actions (see the workflow at `.github/workflows/deploy-backend.yml`).

**4.5 Set Environment Variables in Azure Portal**

Navigate to: `App Service → cybershield-api-prod → Configuration → Application settings`

Add each environment variable from your `.env` file as individual application settings. Do NOT upload the `.env` file — add each key-value pair individually. Azure App Service encrypts these values at rest.

For the `DATABASE_URL`, set it as a Connection String (the Connection Strings section provides an additional layer of access control).

**4.6 Configure Startup Command**

Navigate to: `App Service → Configuration → General settings → Startup command`

Set: `node dist/server.js`

**4.7 Enable Health Check**

Navigate to: `App Service → Health check`

- Enable health check: On
- Path: `/api/v1/health`

---

## Step 5: Frontend Deployment

**5.1 Build the Vite Application**

```bash
cd cybershield-lms/frontend
npm install

# Create production environment file
cat > .env.production << EOF
VITE_API_URL=https://cybershield-api-prod.azurewebsites.net/api/v1
VITE_AZURE_CLIENT_ID=your-client-id-from-step-1
VITE_AZURE_TENANT_ID=your-tenant-id-from-step-1
VITE_AZURE_REDIRECT_URI=https://cybershield.yourcompany.com/auth/callback
EOF

npm run build
```

The production build outputs to the `dist/` directory.

**5.2 Deploy to Azure Static Web Apps**

```bash
# Install the Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Create the Static Web App resource
az staticwebapp create \
  --name cybershield-frontend-prod \
  --resource-group rg-cybershield-prod \
  --source https://github.com/yourorg/cybershield-lms \
  --location eastasia \
  --branch main \
  --app-location frontend \
  --output-location dist

# Deploy the built files
swa deploy ./dist \
  --deployment-token $(az staticwebapp secrets list \
    --name cybershield-frontend-prod \
    --resource-group rg-cybershield-prod \
    --query "properties.apiKey" -o tsv)
```

**5.3 Configure Custom Domain**

Navigate to: `Static Web App → cybershield-frontend-prod → Custom domains → Add`

- Enter your custom domain: `cybershield.yourcompany.com`
- Select the validation method: **CNAME record** or **TXT record** (CNAME recommended)
- Follow the portal instructions to add the DNS record to your DNS provider
- Wait for DNS propagation (typically 5–30 minutes)
- Azure will automatically provision and renew a free managed TLS certificate

**5.4 Configure SPA Routing**

Create a `staticwebapp.config.json` in the `frontend/public/` directory:

```json
{
  "navigationFallback": {
    "rewrite": "/index.html",
    "exclude": ["/api/*", "/assets/*"]
  },
  "globalHeaders": {
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin"
  }
}
```

This ensures that direct URL navigation and browser refresh work correctly for the SPA.

---

## Step 6: Microsoft Teams Webhook Setup

**6.1 Create an Incoming Webhook in Teams**

1. Open Microsoft Teams and navigate to the desired channel (e.g., `#security-alerts`)
2. Click the `...` menu next to the channel name → **Connectors**
3. Search for **Incoming Webhook** → **Configure**
4. Name: `CyberShield Alerts`
5. Upload the CyberShield logo as the webhook avatar (optional)
6. Click **Create**
7. Copy the generated webhook URL

**6.2 Configure the Webhook URL in CyberShield**

Add the webhook URL to the App Service application settings as `TEAMS_WEBHOOK_URL`.

In the CyberShield Admin Console, navigate to:
`Settings → Integrations → Microsoft Teams`

Paste the webhook URL and click **Test Connection**. You should see a test notification in the Teams channel within seconds.

**6.3 Configure Notification Types**

In the Admin Console Teams integration settings, configure which events trigger Teams notifications:
- Phishing simulation click detected: ✅ Enabled (immediate)
- Training overdue (>7 days): ✅ Enabled (daily digest)
- New Security Champion: ✅ Enabled
- Weekly compliance summary: ✅ Enabled (Monday 8am)

---

## Step 7: Microsoft Intune Device Compliance Policy

**7.1 Create a Compliance Policy in Intune**

Navigate to: `Microsoft Endpoint Manager admin center (intune.microsoft.com) → Devices → Compliance policies → Create policy`

- Platform: **Windows 10 and later** (create separate policies for macOS and iOS if applicable)
- Name: `CyberShield - Windows Device Compliance`

Configure the following compliance settings:
- System Security: BitLocker required — **Yes**
- System Security: Secure Boot enabled — **Yes**
- Device Health: Require device to be at or under the machine risk score — **Low**
- Microsoft Defender Antimalware: **Require**
- Microsoft Defender Antimalware security intelligence up-to-date: **Require**
- Real-time protection: **Require**

**7.2 Configure Intune Integration in CyberShield**

The CyberShield App Registration requires the following additional Microsoft Graph application permission:
- `DeviceManagementManagedDevices.Read.All`

Grant admin consent for this permission in the App Registration.

In the Admin Console: `Settings → Integrations → Microsoft Intune → Enable Intune device compliance check`

This adds a device compliance indicator to each user's profile in the admin console.

---

## Step 8: Email Notification Configuration

**8.1 Configure Exchange Online SMTP Relay**

In the Microsoft 365 Admin Center:
1. Navigate to: `Admin → Exchange → Mail flow → Connectors`
2. Create a new connector: From `Office 365` to `Partner organization`
3. Alternatively, use the simpler **SMTP AUTH** approach:
   - Create a dedicated mailbox: `cybershield@yourcompany.com`
   - Enable SMTP AUTH for this specific mailbox (tenant-wide SMTP AUTH can remain disabled for security)
   - Use port 587 with STARTTLS

**8.2 Verify Email Sending**

After configuring SMTP credentials in the backend `.env` / App Service settings:

```bash
# Test via API health endpoint
curl https://cybershield-api-prod.azurewebsites.net/api/v1/admin/test-email \
  -H "Authorization: Bearer <admin-jwt-token>" \
  -H "Content-Type: application/json" \
  -d '{"to": "admin@yourcompany.com"}'
```

Confirm the test email arrives without being flagged as spam.

**8.3 Configure SPF/DKIM/DMARC**

Ensure the sending domain has valid email authentication records. If using Exchange Online as the relay, Microsoft's existing SPF and DKIM records should cover `yourcompany.com` already.

---

## Step 9: Initial Admin Setup

**9.1 Create the First Admin User**

After successful deployment, the seed data creates a default admin user. Update the admin credentials immediately:

```bash
# Connect to the database
psql -h cybershield-db-prod.postgres.database.azure.com \
     -U cybershieldadmin \
     -d cybershield_prod

# Update the default admin email to match your Azure AD admin account
UPDATE users SET email = 'admin@yourcompany.com', 
                azure_oid = 'your-azure-ad-object-id'
WHERE role = 'admin' AND email = 'admin@cybershield.local';
```

Alternatively, use the Admin Bootstrap endpoint (one-time use, disabled after first admin creation):
`POST /api/v1/admin/bootstrap` with your Azure AD token.

**9.2 First Login**

Navigate to `https://cybershield.yourcompany.com` and click **Sign in with Microsoft**. Complete the Azure AD OAuth flow. You should land on the Admin Console dashboard.

**9.3 Configure Organization Settings**

In the Admin Console, navigate to `Settings → Organization`:
- Organization name: Your company name
- Logo: Upload your company logo (PNG, max 2MB)
- Primary contact: Security team email address
- Timezone: Your headquarters timezone
- Date format: Your regional preference

**9.4 Import Users**

Navigate to `Admin Console → Users → Import`:
- **Option A:** Click **Sync from Azure AD** to automatically import all users from your Azure AD tenant
- **Option B:** Upload a CSV file with columns: `email, firstName, lastName, department, role`

Verify the user import completed successfully and all departments are correctly assigned.

---

## Step 10: Testing Checklist

Complete the following tests before go-live:

### Authentication Tests
- [ ] Employee can sign in via Microsoft SSO
- [ ] Admin can sign in and access Admin Console
- [ ] Signing out from Azure AD revokes CyberShield session
- [ ] Disabled Azure AD user cannot access CyberShield
- [ ] MFA is enforced for all logins (verify against Azure AD Conditional Access)

### Training Tests
- [ ] Employee can view assigned courses on dashboard
- [ ] Video/slide content loads correctly
- [ ] Quiz can be completed and submitted
- [ ] Pass/fail logic triggers correctly (retake prompt on fail)
- [ ] Course completion records are saved in database
- [ ] Certificate is generated and downloadable on completion
- [ ] Badge is awarded and displayed in employee profile
- [ ] Completion email is received within 5 minutes

### Phishing Simulation Tests
- [ ] Admin can create a test simulation campaign
- [ ] Simulation email is sent successfully (check spam/junk folder)
- [ ] Clicking the phishing link redirects to education page
- [ ] Click is recorded in the admin console results
- [ ] Alert email/Teams notification is sent to admin on click
- [ ] Reporting a simulated phishing email triggers positive reinforcement response

### Compliance Dashboard Tests
- [ ] Admin dashboard shows accurate completion percentages
- [ ] Department breakdown is correct
- [ ] PDF report exports successfully with correct data
- [ ] CSV export includes all expected columns

### Integration Tests
- [ ] Azure AD user sync runs and imports new test user
- [ ] Deactivating user in Azure AD deactivates in CyberShield within 4 hours (next sync)
- [ ] Teams notification webhook delivers test alert
- [ ] Email notifications are received for all configured event types

---

## Step 11: Go-Live Checklist

Complete all items before communicating availability to users:

- [ ] All Testing Checklist items passed
- [ ] Production `.env` values confirmed (no development/test values in production)
- [ ] Custom domain DNS configured and TLS certificate active (green padlock in browser)
- [ ] Azure AD App Registration redirect URIs include only production URL (remove localhost)
- [ ] Database firewall rule for setup IP removed
- [ ] Backup retention configured and verified
- [ ] Application Insights monitoring active and receiving telemetry
- [ ] Alert rules configured in Azure Monitor
- [ ] Initial compliance training assignments created for all users
- [ ] Welcome email template configured and tested
- [ ] Admin team briefed on Admin Guide and responsibilities
- [ ] Executive sponsor has been briefed and launch communication drafted
- [ ] First phishing simulation campaign scheduled (recommend 2–3 weeks post-launch)
- [ ] Support contact/process communicated to employees

---

## Step 12: Post-Deployment Monitoring

**12.1 Azure Application Insights**

Application Insights is automatically configured when the App Service `APPINSIGHTS_CONNECTION_STRING` environment variable is set. The backend uses the Application Insights Node.js SDK.

Access the Application Insights dashboard at: `Azure Portal → Application Insights → cybershield-appinsights-prod`

Configure the following alerts:

| Alert Name | Condition | Severity | Action |
|---|---|---|---|
| High Error Rate | Server exception rate > 5/min for 5 min | Sev 2 | Email + Teams |
| Slow Response | Average response time > 3 seconds for 10 min | Sev 3 | Email |
| Database Connection Failures | Custom exception count > 3/min | Sev 1 | Email + SMS |
| API Health Check Failure | Health check failing for 2 min | Sev 1 | Email + SMS + PagerDuty |

**12.2 Database Monitoring**

Navigate to: `Azure Database for PostgreSQL → Monitoring → Metrics`

Create alerts for:
- CPU utilization > 80% for 5 minutes
- Storage used > 80%
- Active connections > 80% of maximum
- Replication lag > 30 seconds (for read replica, if configured)

---

## Step 13: SSL/TLS Configuration

### Azure App Service (Backend API)
Azure App Service provides TLS 1.2+ by default. Enforce TLS 1.3 and disable older versions:

Navigate to: `App Service → TLS/SSL settings`
- Minimum TLS version: **1.3** (or 1.2 as minimum acceptable)
- HTTPS Only: **On**

The backend also enforces HTTPS via the `express-sslify` middleware as a defence-in-depth measure.

### Azure Static Web Apps (Frontend)
Azure Static Web Apps automatically provisions and manages TLS certificates for custom domains. TLS 1.2 is the minimum enforced by the platform.

### HSTS Configuration
The backend sets the `Strict-Transport-Security` header via Helmet.js:
```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

After confirming production is stable, submit the domain to the HSTS preload list at hstspreload.org.

---

## Step 14: Backup Configuration

**14.1 Database Backup Verification**

Azure Database for PostgreSQL automated backups are enabled by default. Verify:

Navigate to: `Azure Database for PostgreSQL → Backup and restore`
- Backup retention period: **35 days**
- Backup storage redundancy: **Geo-redundant**

**14.2 Scheduled Backup Test**

Schedule a monthly backup restore test using Azure Automation or a GitHub Actions scheduled workflow:

```bash
# Monthly backup test (run on 1st of each month via scheduled workflow)
az postgres flexible-server restore \
  --resource-group rg-cybershield-test \
  --name cybershield-db-restore-test \
  --source-server cybershield-db-prod \
  --restore-time "$(date -u -d '1 day ago' '+%Y-%m-%dT%H:%M:%SZ')"
```

Run a verification query against the restored database, then delete the restore resource to avoid unnecessary cost.

**14.3 Application Code Backup**

All application code is stored in version-controlled git repositories. The infrastructure is defined in Bicep templates also stored in version control. There is no additional application-level backup needed beyond the database.

---

*For deployment assistance, contact the DevOps team or raise a ticket in the IT Service Desk. This document should be reviewed after each major platform upgrade.*
