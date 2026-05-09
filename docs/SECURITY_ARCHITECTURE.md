# CyberShield LMS — Security Architecture Document

## 1. Authentication & Authorization

### Azure AD SSO Flow

```
User Browser → CyberShield Login Page
    → "Sign in with Microsoft" clicked
    → Redirect to login.microsoftonline.com (Azure AD)
    → Azure AD authenticates user (password + MFA)
    → Azure AD issues authorization code
    → CyberShield backend exchanges code for tokens
    → Backend validates token with Azure AD JWKS endpoint
    → Issues internal JWT (1hr access + 7-day refresh)
    → User session established
```

### JWT Token Lifecycle

| Token Type | Expiry | Storage | Rotation |
|---|---|---|---|
| Access Token | 1 hour | Memory (not localStorage) | On each request if <15 min remaining |
| Refresh Token | 7 days | HttpOnly Secure cookie | On use (rotation) |
| Microsoft ID Token | 1 hour | Not stored | N/A |

**Security controls on tokens:**
- Access tokens stored in memory only — never in localStorage or sessionStorage
- Refresh tokens in HttpOnly, Secure, SameSite=Strict cookies
- Token binding to IP address for high-privilege accounts
- Refresh token rotation: each use invalidates the old token
- All refresh tokens stored as bcrypt hashes in the sessions table

### RBAC Permission Matrix

| Feature | Employee | IT Staff | Manager | Admin |
|---|---|---|---|---|
| View own courses | ✅ | ✅ | ✅ | ✅ |
| Complete courses / quizzes | ✅ | ✅ | ✅ | ✅ |
| View own progress | ✅ | ✅ | ✅ | ✅ |
| Download own certificates | ✅ | ✅ | ✅ | ✅ |
| View leaderboard | ✅ | ✅ | ✅ | ✅ |
| Acknowledge policies | ✅ | ✅ | ✅ | ✅ |
| View department reports | ❌ | ❌ | ✅ | ✅ |
| View all user progress | ❌ | ❌ | ✅ | ✅ |
| Export compliance reports | ❌ | ❌ | ✅ | ✅ |
| Create/edit courses | ❌ | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ❌ | ✅ |
| Launch phishing campaigns | ❌ | ❌ | ❌ | ✅ |
| View audit logs | ❌ | ✅ | ❌ | ✅ |
| Assign training | ❌ | ❌ | ✅ | ✅ |
| Admin dashboard | ❌ | ❌ | ❌ | ✅ |

### Session Management

- Session timeout: 30 minutes of inactivity
- Absolute session limit: 12 hours regardless of activity
- Concurrent sessions: maximum 3 per user
- Session invalidation on: password change, MFA change, admin account disable
- All sessions logged in `sessions` table with IP, user agent, and timestamps

### MFA Enforcement

- All users: MFA required on first login and new device
- Manager and Admin: MFA required on every login
- Conditional: MFA triggered by risk signals (new location, unusual time, new device)
- Backup codes: 8 single-use codes generated at MFA setup, stored as bcrypt hashes
- App used: Microsoft Authenticator (TOTP) — SMS fallback only with IT approval

---

## 2. Data Security

### Data Classification Framework

| Level | Definition | Examples | Controls |
|---|---|---|---|
| **Public** | Approved for public release | Marketing content, public policies | None required |
| **Internal** | General business use | Training materials, org charts | Authentication required |
| **Confidential** | Business-sensitive | Employee data, financial reports | Role-based access + audit log |
| **Restricted** | Highest sensitivity | Client PII, passwords, legal documents | Encryption + strict RBAC + DLP |

### Encryption at Rest

- Database: Azure Database for PostgreSQL with Transparent Data Encryption (TDE) using AES-256
- File uploads: Azure Blob Storage with server-side encryption (Microsoft-managed keys)
- Backup encryption: AES-256 on all Azure backup snapshots
- Sensitive fields in database (tokens, secrets): additional application-level encryption using AES-256-GCM

### Encryption in Transit

- All communication over TLS 1.3 minimum — TLS 1.0 and 1.1 disabled
- HSTS (HTTP Strict Transport Security) with 1-year max-age + includeSubDomains
- Certificate: Azure-managed certificate with auto-renewal
- API: all endpoints HTTPS-only; HTTP redirects to HTTPS with 301

### PII Data Handling

PII collected and stored: Name, email, department, employee ID, IP address, login timestamps, quiz answers.

- PII accessed only by authorized roles (Manager+ for others' PII)
- PII masked in logs: email truncated to j***@company.com in non-admin contexts
- Right to access: employees can view their own data in Profile page
- Data retention: active employee data retained for duration of employment + 1 year
- Deletion: upon employee termination, PII anonymized after 30 days unless legal hold

---

## 3. Application Security — OWASP Top 10 Controls

### A01: Broken Access Control
- RBAC enforced on every API endpoint via middleware
- IDOR prevention: all resource access validates ownership (user can only access their own progress)
- Admin endpoints behind separate RBAC check, logged separately
- Default deny: all endpoints require authentication unless explicitly public

### A02: Cryptographic Failures
- Passwords: bcrypt with cost factor 12 (never stored in plain text or reversible form)
- Tokens: cryptographically random via `crypto.randomBytes(32)` — not Math.random()
- Sensitive data columns use additional AES-256-GCM encryption
- No secrets in source code — all via environment variables, never committed to git

### A03: Injection
- SQL: all queries use parameterized statements via `pg` pool (`$1, $2` placeholders) — no string concatenation
- NoSQL: N/A (PostgreSQL only)
- Command injection: no shell command execution from user input
- LDAP injection: N/A (Azure AD handles identity — no custom LDAP queries)

### A04: Insecure Design
- Threat modeling performed before development
- Phishing simulation tokens are one-time use and expire after 30 days
- Password reset tokens: single-use, 15-minute expiry, bcrypt-hashed in database
- Rate limiting on all sensitive endpoints

### A05: Security Misconfiguration
- Helmet.js configures all security headers:
  ```
  Content-Security-Policy: default-src 'self'; script-src 'self'
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
  ```
- CORS: restricted to approved frontend origin only
- Error messages: production returns generic errors — no stack traces exposed to clients
- Debug mode: disabled in production, enforced via NODE_ENV check

### A06: Vulnerable and Outdated Components
- `npm audit` run in CI/CD pipeline — build fails on critical vulnerabilities
- Dependencies pinned to minor versions with Dependabot auto-PRs for patches
- Regular quarterly dependency updates as part of maintenance cycle

### A07: Identification and Authentication Failures
- Account lockout: 5 failed attempts → 15-minute lockout, logged, admin alerted
- Session fixation prevention: new session ID issued on login
- Secure password reset: time-limited token (15 min), one-time use, sent to verified email
- MFA on all accounts

### A08: Software and Data Integrity Failures
- File uploads: type validation by magic bytes (not just extension), max 10MB, virus scan via Azure Defender
- Signed releases: git tags signed with GPG
- Supply chain: only npm packages with active maintenance and known publishers

### A09: Security Logging and Monitoring Failures
- All authentication events logged: success, failure, MFA prompts
- All admin actions logged with before/after state
- All data exports logged with requesting user and timestamp
- Real-time alerting for: 5+ failed logins, admin privilege use outside business hours, bulk data export

### A10: Server-Side Request Forgery (SSRF)
- No server-side URL fetching from user-supplied input
- Azure Metadata Service access restricted at infrastructure level
- All outbound requests to approved domains whitelist only

---

## 4. Infrastructure Security

### Network Architecture

```
Internet
    ↓
Azure DDoS Protection (Standard)
    ↓
Azure Application Gateway (WAF v2 — OWASP 3.2 ruleset)
    ↓
Azure App Service (HTTPS only, VNet integrated)
    ↓
Azure Virtual Network (private subnet)
    ↓
Azure Database for PostgreSQL (Flexible Server, no public endpoint)
    ↓
Azure Blob Storage (private endpoint only)
```

### WAF Rules Enabled

- OWASP Core Rule Set 3.2
- Bot Manager rules
- Custom rules: block requests from anonymizing proxies and Tor exit nodes
- Rate limiting: 100 requests/minute per IP before WAF challenge
- Geo-blocking: configurable per deployment

### DDoS Protection

- Azure DDoS Protection Standard on the Virtual Network
- Application-layer DDoS mitigated by Azure Application Gateway
- API rate limiting (Express rate limiter): 100 req/15min general, 5 req/15min for authentication

---

## 5. Audit & Monitoring

### What Is Logged (Complete List)

**Authentication Events:**
- Successful login (user, timestamp, IP, device, method: SSO/password)
- Failed login attempt (user, timestamp, IP, reason)
- MFA prompt sent, approved, rejected
- Password change, password reset
- Account lockout, account unlock
- Session created, session expired, session revoked

**User Activity:**
- Course started, module completed, course completed
- Quiz submitted (score, pass/fail, attempt number)
- Certificate downloaded
- Policy acknowledged
- Phishing link clicked, phishing reported

**Admin Actions:**
- User created, modified, deactivated, deleted
- Role change (old role → new role)
- Course created, published, archived
- Training assignment created, modified
- Phishing campaign launched, paused, completed
- Report generated, exported (user + timestamp)
- Audit log viewed/exported

**Data Access:**
- Bulk user data export
- Individual user PII accessed by admin
- Certificate batch download

### Log Retention Policy

| Storage Tier | Retention | Access |
|---|---|---|
| Hot (Azure Table Storage) | 90 days | Real-time query via UI |
| Cold (Azure Blob, compressed) | 12 months | Download on request |
| Archive (Azure Archive tier) | 7 years | Restore within 15 hours |

### Alerting Rules

| Trigger | Severity | Response |
|---|---|---|
| 5+ failed logins from same IP | High | Auto-block IP, alert Security team |
| Admin login outside business hours | Medium | Alert Security team |
| Bulk export >500 records | High | Alert Security team + Manager |
| First admin action after PIM elevation | Info | Log only |
| Phishing link clicked by 10+ users simultaneously | Critical | Suspend campaign, alert Security team |
| Account enabled after long dormancy (>90 days) | Medium | Alert Security team |

---

## 6. Compliance Mapping

### ISO 27001:2022 Controls Addressed

| Control Domain | Controls Implemented |
|---|---|
| A.5 Organizational Controls | Information security policies, roles, training program |
| A.6 People Controls | Screening awareness, training, disciplinary process |
| A.7 Physical Controls | Clean desk policy, screen lock, visitor management |
| A.8 Technological Controls | Access control, authentication, cryptography, logging, patching |

### SOC 2 Trust Service Criteria

| Criteria | Implementation |
|---|---|
| CC6.1 Logical Access | RBAC, MFA, SSO, session management |
| CC6.2 Authentication | Azure AD, MFA, strong passwords, account lockout |
| CC6.3 Authorization | RBAC roles, least privilege, IDOR prevention |
| CC7.2 Monitoring | Audit logs, alerting, SIEM integration |
| CC9.2 Vendor Management | Azure SLAs, Microsoft compliance certifications |

### GDPR/PDPA Considerations

- Data Processing Agreement (DPA) with Azure/Microsoft in place
- Employee data processed based on legitimate interest (security training legal requirement)
- Data Subject Rights: access and deletion available through HR
- Data Breach Notification: 72-hour notification to DPA if breach involves personal data
- Privacy Notice: visible in application footer and in onboarding email
