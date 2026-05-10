# CyberShield — Enterprise Cybersecurity Awareness Training Platform

> **A complete, deployable cybersecurity awareness ecosystem for BPO and enterprise organizations.**

CyberShield is a full-stack internal LMS purpose-built for cybersecurity awareness training. It combines an engaging employee training platform with powerful admin tools, phishing simulation capabilities, and comprehensive compliance reporting.

---

## Platform Overview

| Component | Technology | Purpose |
|---|---|---|
| **Frontend** | React 18 + TypeScript + Vite + Tailwind CSS | Employee & Admin UI |
| **Backend** | Node.js + Express + TypeScript | REST API |
| **Database** | PostgreSQL 15 | Data persistence |
| **Authentication** | Azure AD SSO + JWT | Identity & access |
| **Deployment** | Azure App Service + Azure Static Web Apps | Cloud hosting |

**Design Theme:** Orange (#F97316) / Dark Gray (#111827) / White — modern SaaS dashboard aesthetic.

---

## What's Included

### Training Platform
- **20 courses** across 5 security tracks with full slide content, quizzes, and scenarios
- Quiz engine with pass/fail, retakes, timer, and animated feedback
- Certificate issuance and download
- Gamification: XP points, badges, streaks, leaderboards
- Progress tracking per employee
- Policy acknowledgment workflow

### Admin Tools
- User management (import CSV, RBAC, activate/deactivate)
- Course management (create, publish, assign)
- Phishing simulation campaigns (10 templates included)
- Compliance reporting (ISO 27001, SOC 2, PCI-DSS aligned)
- Audit log viewer with export
- Department compliance dashboards

### Microsoft 365 Integration
- Azure AD SSO (single sign-on with company credentials)
- Microsoft Teams webhook notifications
- Intune device compliance awareness
- Microsoft Graph API for user sync

---

## Training Curriculum (20 Courses)

### Track 1: Core Cybersecurity Awareness
1. Password Security & MFA Fundamentals
2. Phishing & Social Engineering Defense
3. Email Security Best Practices
4. Remote Work & Device Security
5. Physical Security & Clean Desk Policy

### Track 2: BPO-Specific Data Security
6. Protecting Client Data & PII Handling
7. PCI-DSS Awareness for BPO Staff
8. Screen Privacy & Unauthorized Screenshots
9. Client Compliance Expectations

### Track 3: Microsoft 365 Security
10. Safe Use of Microsoft 365 & Teams
11. OneDrive & SharePoint Security
12. Intune Device Management Awareness
13. Conditional Access & Identity Security

### Track 4: IT & Helpdesk Security
14. Privileged Account Management
15. Identity Verification & Ticket Security
16. Secure Remote Support Practices
17. Patch Management & Endpoint Security

### Track 5: AI & Modern Threats
18. AI-Generated Phishing & Deepfakes
19. MFA Fatigue, Ransomware & Shadow IT
20. Safe AI Usage Policy

---

## Project Structure

```
cybershield-lms/
├── frontend/                   # React TypeScript SPA
│   └── src/
│       ├── components/         # Sidebar, Header, CourseCard, QuizCard, Badge
│       ├── pages/              # Login, Dashboard, Courses, Quiz, Leaderboard, Profile
│       │   └── admin/          # AdminDashboard, UserMgmt, Phishing, Compliance, AuditLogs
│       ├── context/            # AuthContext, AppContext
│       ├── data/               # curriculum.ts (20 courses), phishing-scenarios.ts
│       └── types/              # TypeScript interfaces
├── backend/                    # Node.js Express API (5,514 lines, 0 TS errors)
│   └── src/
│       ├── controllers/        # auth, courses, admin, reports
│       ├── routes/             # auth, users, courses, admin, reports, notifications
│       ├── middleware/         # JWT auth, RBAC, audit logging
│       └── services/           # email, phishing simulation
├── database/
│   ├── schema.sql              # 22-table PostgreSQL schema with indexes
│   └── seed.sql                # Sample users, departments, assignments
├── curriculum/
│   └── modules/                # Full slide content, speaker notes, scenarios
│       ├── 01-core-cybersecurity/
│       ├── 02-bpo-security/
│       ├── 03-microsoft-security/
│       ├── 04-it-helpdesk/
│       └── 05-ai-threats/
└── docs/
    ├── EXECUTIVE_SUMMARY.md    ├── ARCHITECTURE.md
    ├── DEPLOYMENT.md           ├── ADMIN_GUIDE.md
    ├── USER_GUIDE.md           ├── SECURITY_ARCHITECTURE.md
    ├── KPI_METRICS.md          ├── AWARENESS_CALENDAR.md
    ├── PHISHING_SIMULATIONS.md ├── EMPLOYEE_COMMUNICATIONS.md
    └── policies/               # AUP, Incident Response, Clean Desk, AI Usage
```

---

## Quick Start (Development)

```bash
# Install dependencies
npm install --workspace=frontend
npm install --workspace=backend

# Configure environment
cp backend/.env.example backend/.env
# Edit .env with your Azure AD tenant ID, client ID, DB connection string

# Set up database
psql -U postgres -c "CREATE DATABASE cybershield_lms;"
psql -U postgres -d cybershield_lms -f database/schema.sql
psql -U postgres -d cybershield_lms -f database/seed.sql

# Start development (two terminals)
cd frontend && npm run dev   # → http://localhost:3000
cd backend  && npm run dev   # → http://localhost:3001
```

### Demo Accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@cybershield.local | Admin@CyberShield2024 |
| Manager | manager@cybershield.local | Manager@CS2024 |
| Employee | employee@cybershield.local | Employee@CS2024 |

---

## Security Highlights

- Azure AD SSO + MFA enforcement
- JWT (1hr access / 7-day rotating refresh tokens in HttpOnly cookies)
- RBAC with 4 roles: Employee, IT Staff, Manager, Admin
- OWASP Top 10 mitigations (parameterized SQL, CSP, rate limiting, Helmet.js)
- Full audit logging with 90-day hot retention / 12-month cold storage
- AES-256 encryption at rest, TLS 1.3 in transit

---

## Compliance Alignment

| Framework | Coverage |
|---|---|
| ISO 27001:2022 | A.5, A.6, A.7, A.8 control domains |
| SOC 2 Type II | CC6.1–CC6.3, CC7.2, CC9.2 |
| PCI-DSS v4.0 | Requirement 12.6 (Security Awareness) |
| HIPAA | §164.308(a)(5) Security Awareness Training |
| GDPR/PDPA | Employee data protection training obligations |

---

## KPI Targets

| Metric | Target |
|---|---|
| Training Completion Rate | ≥ 95% |
| Phishing Click Rate (12-month goal) | < 10% |
| Phishing Report Rate | > 70% |
| MFA Adoption | 100% |
| Overall Compliance Score | ≥ 90% |

---

*CyberShield — Built for BPO. Designed for humans. Powered by Microsoft 365.*