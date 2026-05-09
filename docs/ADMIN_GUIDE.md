# CyberShield LMS — Administrator Guide

**Classification:** Internal — Confidential  
**Version:** 1.0  
**Last Updated:** May 2026  
**Audience:** CyberShield Platform Administrators

---

## Introduction

This guide is for designated CyberShield administrators responsible for managing the platform on a day-to-day basis. As an administrator, you have full access to all platform features: user management, course administration, phishing simulation campaigns, compliance reporting, audit logs, and system configuration.

Administrator accounts have elevated access to sensitive data, including individual training records, phishing simulation results, and audit logs. This access must be used responsibly and in accordance with your organization's access control policies.

**Quick Access:**
- Platform URL: `https://cybershield.yourcompany.com`
- Admin Console: `https://cybershield.yourcompany.com/admin`
- Support: `cybershield-support@yourcompany.com`

---

## Section 1: First-Time Setup Walkthrough

### 1.1 Initial Login

Navigate to the Admin Console URL and sign in with your Microsoft 365 account. Your account must have been designated as a CyberShield administrator either during initial setup or by another existing administrator.

On first login, you will be presented with the **Setup Wizard**. Complete each step in order — the wizard ensures the platform is configured correctly before users are onboarded.

### 1.2 Setup Wizard Steps

**Step 1: Organization Profile**
- Enter your organization's legal name and display name
- Upload your organization logo (PNG, 400x100px recommended, max 2MB)
- Set your headquarters timezone and date format
- Enter the primary security contact email address (this receives all administrative alerts)

**Step 2: Azure AD Integration**
- Confirm the Azure AD Tenant ID and Client ID are populated from the deployment configuration
- Click **Test Azure AD Connection** — a green checkmark confirms the connection is working
- Click **Run Initial User Sync** to import all users from Azure AD
- Review the sync results: number of users imported, departments found, any errors

**Step 3: Email Configuration**
- Review the SMTP configuration (pre-configured during deployment)
- Click **Send Test Email** and enter your email address
- Confirm receipt of the test email within 5 minutes

**Step 4: Course Library**
- The default course library includes the standard BPO cybersecurity curriculum
- Review each course title and description
- Enable the courses you want to assign (toggle to Active)
- Recommended starting courses: Phishing Awareness Fundamentals, Password Security, Data Handling and Classification

**Step 5: Department Setup**
- Review the departments imported from Azure AD
- Assign department-level risk ratings (High/Medium/Low) based on data access profiles
- Example: Customer Service (High — handles PII), IT (High — privileged access), HR (Medium), Finance (High — financial data)

**Step 6: Admin Accounts**
- Review who has administrator access
- Add or remove administrator accounts as appropriate
- Confirm your own account details are correct

Once all steps are complete, click **Finish Setup**. The Setup Wizard will not appear again. You can revisit any settings through the **Settings** menu.

---

## Section 2: User Management

### 2.1 Viewing Users

Navigate to `Admin Console → Users`. The Users table displays all users in your organization with the following columns: Name, Email, Department, Role, Status (Active/Inactive), Last Login, and Compliance Score.

Use the search bar to find users by name or email. Use the Department and Status filter dropdowns to narrow results.

### 2.2 Adding Individual Users

For occasional manual additions (e.g., contractors not in Azure AD):

1. Click **+ Add User**
2. Fill in: First Name, Last Name, Email Address, Department, Role
3. Select: Employee, IT Staff, Manager, or Admin
4. Check **Send welcome email** to notify the user immediately
5. Click **Create User**

Note: Manual users created outside Azure AD will not be updated during automated sync. If the user is added to Azure AD later, their records will be merged automatically on first SSO login based on matching email address.

### 2.3 Importing Users via CSV

For bulk imports (new hire batches, organizational restructures):

1. Navigate to `Users → Import → Download CSV Template`
2. The template contains columns: `email, firstName, lastName, department, role, manager_email`
3. Fill in the template — do not modify column headers
4. Navigate back to `Users → Import → Upload CSV`
5. Review the import preview: correct column mappings, review any rows with errors (highlighted in red)
6. Click **Import** to process

The system will create new users and update existing users (matched by email). Rows with duplicate emails update the existing record rather than creating duplicates.

**CSV Import Tips:**
- Maximum 500 rows per import file
- `role` must be exactly one of: `employee`, `it_staff`, `manager`, `admin`
- `department` must match an existing department name exactly (case-insensitive)
- `manager_email` is optional but recommended for department hierarchy reporting

### 2.4 Deactivating Users

When an employee leaves or is placed on suspension:

**Automated:** Users disabled or deleted in Azure AD are automatically deactivated in CyberShield within 4 hours (next sync cycle).

**Manual:** Navigate to `Users → [User Name] → Deactivate`. Enter the reason for deactivation (for audit log). Deactivated users immediately lose all access but their training records are preserved for audit purposes.

**Reactivation:** A deactivated user can be reactivated by navigating to `Users → [User Name] → Reactivate`. If the user was removed from Azure AD and then re-added (common with rehires), use the **Restore User** option which re-links the existing training history to the new Azure AD account.

### 2.5 Role Assignment

CyberShield has four roles:

| Role | Description | Key Permissions |
|---|---|---|
| Employee | Standard user | View own training, complete courses, view own score |
| Manager | Team/department lead | View team reports, receive team compliance alerts |
| IT Staff | IT/security team | View all phishing results, manage their own team |
| Admin | Platform administrator | Full access to all features and data |

To change a user's role: `Users → [User Name] → Edit → Role → Save`

**Important:** Only existing Admins can grant Admin role. Do not grant Admin role to accounts shared between multiple people.

---

## Section 3: Course Management

### 3.1 Course Library Overview

Navigate to `Admin Console → Courses`. Courses are organized into categories: Phishing Awareness, Password Security, Data Handling, Social Engineering, Remote Work Security, Regulatory Compliance, and AI Safety.

Each course shows: Title, Category, Duration (minutes), Active/Inactive status, number of enrolled users, and average quiz score.

### 3.2 Creating a New Course

1. Click **+ Create Course**
2. **Basic Information:**
   - Title: Clear, descriptive name (e.g., "Recognizing Business Email Compromise")
   - Description: 2–3 sentences explaining what the course covers and why it matters
   - Category: Select from dropdown
   - Difficulty: Beginner / Intermediate / Advanced
   - Estimated Duration: Enter estimated completion time in minutes
   - Tags: Add searchable tags (e.g., "phishing", "email", "bec")
3. **Content Modules:** Add one or more content modules (see 3.3)
4. **Assessment:** Configure the final quiz (see 3.4)
5. **Certificate:** Enable certificate issuance on completion (recommended for compliance courses)
6. Click **Save as Draft**

### 3.3 Adding Content Modules

Within a course, click **+ Add Module**. Each module has a type:
- **Video:** Upload an MP4 file (max 500MB) or paste a Microsoft Stream/SharePoint URL
- **Slides:** Upload a PowerPoint file or PDF — the platform renders slides with navigation controls
- **Interactive Scenario:** A branching scenario where employees make choices and see consequences (built using the scenario builder)
- **Text/Reading:** Rich text content with embedded images

Modules are presented to the learner in the order shown. Drag to reorder. Each module can be marked as **Required** (learner must complete it to progress) or **Optional** (skippable).

### 3.4 Configuring Assessments

1. In the course editor, navigate to the **Assessment** tab
2. Click **+ Add Question**. Question types: Multiple Choice, True/False, Scenario (select the correct action)
3. For each question: enter the question text, all answer options, and mark the correct answer
4. Add an explanation for the correct answer — this is shown to learners after submitting
5. **Assessment Settings:**
   - Passing score: 80% recommended for most compliance courses
   - Maximum attempts: 3 (learner can retake up to 3 times before triggering admin alert)
   - Time limit: Leave blank for untimed (recommended) or set in minutes
   - Shuffle questions: Yes (recommended, reduces sharing of answers)

### 3.5 Publishing a Course

A course must be **Published** to be visible and assignable to employees. Draft courses are not visible to employees.

1. Navigate to the course you want to publish
2. Complete the pre-publish checklist (the system validates: at least one module, at least 5 quiz questions, passing score configured)
3. Click **Publish**

To unpublish a course (e.g., for significant content updates), click **Unpublish**. Employees currently enrolled in the course will see a "Course temporarily unavailable" message. Completed records are preserved — completing the updated version creates a new completion record.

---

## Section 4: Training Assignments

### 4.1 Creating a Training Assignment

Navigate to `Admin Console → Assignments → New Assignment`

1. **Assignment Details:**
   - Name: Descriptive name (e.g., "Q3 2026 Mandatory Phishing Awareness")
   - Description: Brief explanation for the notification email to employees
   - Course(s): Select one or more courses from the course library
2. **Audience:**
   - All Users, Specific Departments, Specific Roles, or Select Individuals
3. **Due Date:** Set a due date — employees receive automated reminders at 7 days and 1 day before the deadline, and an overdue alert after the deadline
4. **Notifications:** Configure whether to send assignment notification email immediately or schedule it
5. Click **Create Assignment**

### 4.2 Bulk Department Assignment

For organization-wide mandatory training:

1. Select `All Users` or specific departments
2. The system shows a count of users who will receive the assignment
3. Review the count carefully — confirm it matches your expected audience
4. Set a realistic due date (30 days is recommended for organization-wide mandatory training)

### 4.3 Monitoring Assignment Progress

Navigate to `Assignments → [Assignment Name]`

The assignment detail page shows:
- Overall completion percentage
- Number of users: Not Started / In Progress / Completed / Failed (did not pass quiz)
- Department breakdown: See which departments are lagging
- Individual list: Sortable by completion status, last activity, score

Click **Export** to download the current status as CSV or PDF.

### 4.4 Sending Manual Reminders

If automated reminders are not driving action:
1. Filter the assignment to "Not Started" or "In Progress" users
2. Select all or specific users using the checkboxes
3. Click **Send Reminder** → Choose template or customize message → **Send**

Manual reminders are logged in the audit log.

---

## Section 5: Phishing Simulation Campaigns

### 5.1 Planning a Campaign

Before creating a campaign, document:
- **Objective:** What behavior are you testing? (e.g., resistance to credential harvesting)
- **Template:** Which simulation template will you use? (See Phishing Simulation Playbook)
- **Audience:** All users, or a specific department or risk group?
- **Launch timing:** Avoid Mondays (high email volume), end-of-quarter (stress periods), or during known company events
- **Duration:** Recommended 5–7 business days for the simulation window
- **Notification to management:** Have you briefed senior managers so they are not alarmed?

### 5.2 Creating a Phishing Campaign

Navigate to `Admin Console → Phishing → New Campaign`

1. **Campaign Details:**
   - Campaign name: Internal reference (e.g., "May 2026 - Microsoft Login Simulation")
   - Simulation type: Select from template library
   - Audience: Select target group

2. **Template Configuration:**
   - Review the pre-built template (email subject, body, sender name)
   - Customize the sender name to match your organization's naming conventions
   - Review the tracked link — the system generates a unique tracking domain per campaign

3. **Schedule:**
   - Launch date and time (recommended: Tuesday–Thursday, 9–11am local time)
   - Campaign end date (7 days recommended)
   - Staggered send: Enable to send emails across a 4-hour window rather than all at once

4. **Post-Click Education:**
   - Select the educational landing page shown to users who click the link
   - Each template has a recommended educational page — use the default unless you have custom content

5. **Notifications:**
   - Real-time admin alerts: Teams webhook on every click (recommended for small campaigns, may be noisy for large ones)
   - Daily summary: One digest email per day showing click counts
   - Final report: Sent automatically when campaign closes

6. Click **Save as Draft** → Review all settings → **Launch Campaign**

### 5.3 Reviewing Campaign Results

Navigate to `Phishing → [Campaign Name] → Results`

**Key metrics displayed:**
- **Sent:** Total emails delivered
- **Opened:** Email opened (tracked via pixel — indicator only, not always reliable)
- **Clicked:** Tracking link clicked (primary metric)
- **Reported:** Users who reported the email via the Phishing Report button
- **Click Rate:** Clicked / Sent × 100
- **Report Rate:** Reported / Sent × 100

**Department breakdown:** Identify which departments have the highest click rates — these departments need priority follow-up training.

**Individual results:** Download the full individual results CSV for detailed follow-up. Individual results are visible to Admins only — managers see only their team's aggregate data.

**Repeat Clickers:** Users who clicked in multiple campaigns are flagged for targeted intervention. Navigate to their profile and assign the advanced phishing awareness course.

---

## Section 6: Compliance Reporting

### 6.1 Understanding the Compliance Dashboard

Navigate to `Admin Console → Reports → Compliance Dashboard`

**Overall Compliance Score:** A weighted average of Training Completion Rate (40%), Certificate Currency (30%), and Policy Acknowledgment Rate (30%). The score is expressed as a percentage with a RAG status:
- Green: 85%+
- Amber: 70–84%
- Red: Below 70%

**Trend Chart:** Rolling 12-month trend of the overall compliance score. A steady upward trend indicates a healthy program.

**Department Breakdown:** Bar chart showing each department's compliance score. Hover for exact values. Click a department to drill down into individual users.

### 6.2 Generating Reports

Navigate to `Reports → Generate Report`

**Report Types:**
- **Executive Summary:** One-page overview with overall scores and key trends — designed for leadership review
- **Full Compliance Report:** Detailed multi-page report with all metrics, department breakdowns, and individual records
- **Department Report:** Compliance data for a single department — suitable for sharing with department heads
- **Phishing Summary Report:** Aggregated phishing simulation results across all campaigns in a date range
- **Certificate Status Report:** All active and expired certificates with renewal dates
- **Audit Evidence Package:** A combined document bundle suitable for ISO 27001 / SOC 2 auditors

**Scheduling Reports:**
Click **Schedule Report** on any report type to configure automatic delivery:
- Frequency: Weekly / Monthly / Quarterly
- Recipients: Select users or enter email addresses manually
- Format: PDF or CSV (or both)

### 6.3 Exporting Data

All tables in the Admin Console support CSV export. For custom data exports:
`Reports → Data Export → Select fields and date range → Export CSV`

Exports are logged in the audit trail for data governance purposes.

---

## Section 7: Audit Log Review

### 7.1 Accessing the Audit Log

Navigate to `Admin Console → Audit Log`

The audit log records every security-relevant action in the platform. It is append-only — records cannot be modified or deleted through the application interface.

**Key columns:** Timestamp, User (who performed the action), Action Type, Resource, IP Address, Result (Success/Failure), Details.

### 7.2 What to Look For

**Weekly review items:**
- Failed login attempts: Multiple failed attempts from the same IP or for the same user account may indicate a brute force attempt or a compromised credential
- Admin actions: Review all actions with action type "admin.*" to confirm they are expected
- Data exports: Unusual export activity (large data dumps, exports at unusual hours) should be investigated
- Role changes: Any changes to user roles, particularly new Admin accounts granted

**Signs requiring immediate investigation:**
- Admin login from an unexpected IP address or geographic location
- Multiple accounts accessed from the same IP in a short time window (credential stuffing indicator)
- A large number of records accessed by a single user in one session
- Any action type containing "bulk_delete" or "export_all"

### 7.3 Security Alerts

The system automatically generates alerts for high-risk audit events. Navigate to `Settings → Alert Rules` to review and configure which events trigger alerts.

Pre-configured alert rules include:
- Failed admin login: 5 failures in 10 minutes
- Bulk user export: Any admin exports more than 500 user records
- New Admin account created: Immediate notification to all existing Admins
- Phishing simulation click: Immediate notification (if campaign notifications enabled)

---

## Section 8: Notification Management

Navigate to `Admin Console → Settings → Notifications`

**Employee Notifications:** Configure which events trigger emails to employees:
- New training assignment (recommended: On)
- Training due in 7 days (recommended: On)
- Training overdue (recommended: On)
- Course completion/certificate issued (recommended: On)
- Badge earned (recommended: On)
- Policy acknowledgment reminder (recommended: On)

**Admin Notifications:** Configure which events trigger notifications to admins:
- Daily training digest (recommended: On — 8am Monday)
- Weekly compliance summary (recommended: On — Monday 8am)
- Phishing click alert (recommended: On)
- New Security Champion nomination (recommended: On)

**Notification Templates:** Navigate to `Settings → Notifications → Templates` to customize the email templates for each notification type. Templates support variables: `{{firstName}}`, `{{courseName}}`, `{{dueDate}}`, `{{completionDate}}`, `{{score}}`, `{{badgeName}}`.

---

## Section 9: Integration Management

### 9.1 Azure AD Sync

Navigate to `Settings → Integrations → Azure Active Directory`

**Sync Status:** Shows last sync time, duration, users added/updated/deactivated, and any errors.

**Manual Sync:** Click **Sync Now** to trigger an immediate sync outside the automated 4-hour schedule. Use this after large-scale user additions in Azure AD (e.g., after a new hire onboarding batch).

**Sync Conflict Resolution:** When a user attribute changes in Azure AD (e.g., department change), the sync overwrites the CyberShield value. If you have manually overridden a user's department in CyberShield and want to preserve that override, check the **Lock department from sync** option on the user's profile.

### 9.2 Microsoft Teams Integration

Navigate to `Settings → Integrations → Microsoft Teams`

- Test the webhook connection with **Send Test Message**
- Review the connected channel name
- Enable/disable individual notification types for Teams vs. email

### 9.3 Intune Integration

Navigate to `Settings → Integrations → Microsoft Intune`

The Intune integration is read-only. CyberShield queries device compliance status for informational purposes only. If a user's device is marked non-compliant in Intune, a flag appears on their CyberShield profile visible to admins.

Optionally, enable **Auto-assign device compliance course** — this automatically assigns a short "Keeping Your Device Secure" training module to users whose devices are marked non-compliant.

---

## Section 10: Troubleshooting Common Issues

### Users Cannot Log In
1. Confirm the user exists in Azure AD and is enabled
2. Check the CyberShield user record: `Users → [User] → Status = Active`
3. If recently added to Azure AD, run a manual sync and retry
4. Check the audit log for the user's failed login attempts to identify the specific error
5. Clear browser cookies and retry, or try in an incognito window

### Phishing Email Lands in Spam/Junk
1. Verify the simulation email domain is added to the organization's email allowlist (whitelist)
2. Configure a mail flow rule in Exchange Online to bypass spam filtering for the simulation domain
3. Coordinate with IT to add the simulation tracking domain to Defender for Office 365 exclusions

### Training Completion Not Recorded
1. Ask the employee to refresh their dashboard
2. Check `Users → [User] → Training History` — if the completion record is missing, the user may need to re-complete the final module
3. Check browser console for JavaScript errors (common on older browsers or browser extensions that block scripts)
4. Ensure the employee is not using a private/incognito window without being authenticated

### Certificate Not Generating
1. Confirm the course has certificate issuance enabled (`Courses → [Course] → Settings → Issue Certificate on Completion = Yes`)
2. Confirm the employee passed the quiz (minimum passing score met)
3. Check the `jobs` log in Application Insights for certificate generation errors

### Azure AD Sync Errors
1. Navigate to `Settings → Integrations → Azure AD → Sync History`
2. Click the failed sync to see the error details
3. Common errors: insufficient API permissions (re-grant consent in Azure AD), expired client secret (rotate and update App Service settings), Graph API throttling (wait 1 hour and retry)

---

## Section 11: Best Practices for Compliance Programs

**Assign training before it is needed.** Don't wait until an audit is imminent. Assign the annual compliance training modules at the start of each fiscal year with a 30-day completion window.

**Use phishing simulations monthly.** A single annual phishing test produces a single data point. Monthly simulations create a continuous learning loop. Vary the template type so employees don't become desensitized to one scenario.

**Engage managers.** Department heads who regularly see their team's compliance scores and receive escalations for overdue training drive completion rates significantly higher than admin reminders alone. Set up automated weekly manager emails showing their team's current status.

**Recognize success publicly.** Use the Security Champions program to publicly recognize employees with consistently high security scores or who actively report phishing simulations. Visibility of positive recognition drives broader participation.

**Document everything.** Before every audit, run the Audit Evidence Package report. It produces a complete bundle of compliance evidence — training records, quiz scores, policy acknowledgments, phishing simulation results — formatted for auditor review.

**Review the curriculum annually.** Threat scenarios evolve. Review your course library and phishing simulation templates at least once per year and update to reflect current attack trends.

---

## Section 12: Monthly Admin Checklist

Complete the following tasks on the first Monday of each month:

- [ ] Review overall compliance score — investigate any drop from prior month
- [ ] Check for users with overdue training (>7 days past due) — escalate to their managers
- [ ] Review audit log for any unusual activity from the prior month
- [ ] Review phishing simulation results from the prior month — identify repeat clickers
- [ ] Check certificate expiry — note any certificates expiring in the next 60 days
- [ ] Send monthly compliance report to the Security Manager / CISO
- [ ] Review Azure AD sync log — confirm no sync errors in the past 30 days
- [ ] Check for any new employees added in the past 30 days — confirm they received a welcome and initial training assignment
- [ ] Confirm Teams webhook is still active (Teams webhooks can expire on inactive channels)
- [ ] Review Application Insights for any error rate spikes
- [ ] Plan next phishing simulation campaign for the month
- [ ] Review policy acknowledgment status — any new policies needing acknowledgment?

---

## Section 13: Incident Response When Employee Clicks Phishing Link

If an employee clicks a **real** phishing link (not a simulation), the response must be immediate.

**Step 1: Isolate (within 15 minutes)**
- Work with IT to isolate the employee's workstation from the network immediately
- Reset the employee's Microsoft 365 password and revoke all active sessions via Azure AD
- Revoke the employee's CyberShield session (Admin Console → Users → [User] → Revoke Active Sessions)

**Step 2: Assess (within 1 hour)**
- Determine what credentials may have been exposed
- Review Azure AD Sign-in logs for any suspicious logins in the past 24 hours
- Review email access logs for unauthorized email access or forwarding rules
- Assess whether any client data was accessible from the compromised account

**Step 3: Contain**
- If any client data was potentially accessed, trigger the Incident Response procedure per the Incident Response Policy
- Enable MFA step-up verification for any related accounts accessed from the same device
- Scan the affected workstation for malware

**Step 4: Educate**
- After the immediate technical response, schedule a one-on-one with the employee
- Assign the Advanced Phishing Awareness module in CyberShield with a 3-day completion requirement
- The conversation should be supportive, not punitive — focus on learning

**Step 5: Document**
- Record the incident in the audit log: `Incidents → New Incident Record`
- Complete the post-incident review template within 5 business days
- Update phishing simulation campaign templates if the attack vector is not already covered

---

## Section 14: Managing Certificate Expiry

**Viewing Certificate Status**

Navigate to `Reports → Certificates`. The certificate view shows:
- All issued certificates
- Issue date and expiry date (certificates expire 1 year after issue by default)
- Renewal status (Active / Expiring in 60 days / Expiring in 30 days / Expired)

**Automated Renewal Reminders**

The system automatically sends renewal reminder emails to employees at:
- 60 days before certificate expiry: "Your compliance certificate expires in 60 days"
- 30 days before: "Your compliance certificate expires in 30 days — please complete the renewal training"
- 7 days before: Urgent reminder
- On expiry date: Certificate expired notification + immediate training assignment

**Bulk Renewal Assignments**

At the start of each year, run the **Certificate Renewal Report** to identify all certificates expiring in the next 12 months. Use **Bulk Assignment** to create a training assignment for the renewal cohort with an appropriate due date.

**Handling Expired Certificates in Audits**

If an auditor requests certificate records:
- Export the Certificate Status Report for the relevant date range
- Certificates that expired and were subsequently renewed show both the expired record and the renewed record
- The compliance score reflects current certificate status — an expired certificate reduces the score until the renewal training is completed

---

*This guide is maintained by the CyberShield platform administrator team. For feedback or corrections, contact `cybershield-support@yourcompany.com`. Review and update this guide quarterly or after any significant platform update.*
