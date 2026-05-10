# CyberShield LMS — System Architecture Document

**Classification:** Internal — Confidential  
**Version:** 1.0  
**Last Updated:** May 2026

---

## 1. Architecture Overview

CyberShield LMS is built on a modern, cloud-native three-tier architecture hosted entirely on Microsoft Azure. The three logical tiers are:

1. **Presentation Tier (Frontend):** A single-page application (SPA) built with React 18 and TypeScript, served via Azure Static Web Apps and distributed through Azure CDN. The frontend communicates exclusively with the backend API over HTTPS.

2. **Application Tier (Backend API):** A RESTful API built with Node.js, Express, and TypeScript deployed on Azure App Service. The API handles all business logic, authentication validation, data access, and integration with external services.

3. **Data Tier (Database):** PostgreSQL 15 hosted on Azure Database for PostgreSQL — Flexible Server. All persistent data storage, including user records, course completions, simulation results, audit logs, and compliance reports, resides here.

This separation of concerns ensures independent scalability of each tier, clear security boundaries enforced at each layer, and clean deployment pipelines.

```
┌─────────────────────────────────────────────────────────────────────┐
│                         INTERNET / CLIENTS                          │
└──────────────────────────────┬──────────────────────────────────────┘
                               │ HTTPS (TLS 1.3)
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                    AZURE FRONT DOOR / CDN LAYER                     │
│           (DDoS Protection, WAF, SSL Termination, CDN)              │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
              ┌────────────────┴────────────────┐
              ▼                                  ▼
┌─────────────────────────┐       ┌─────────────────────────────────┐
│  AZURE STATIC WEB APPS  │       │     AZURE APP SERVICE           │
│  React 18 + TypeScript  │──────▶│     Node.js + Express + TS      │
│  (Frontend SPA)         │ API   │     (Backend REST API)          │
└─────────────────────────┘ calls └──────────────┬──────────────────┘
                                                  │
                                    ┌─────────────┴──────────────┐
                                    ▼                             ▼
                     ┌──────────────────────┐   ┌───────────────────────┐
                     │  AZURE DATABASE FOR  │   │  AZURE ACTIVE         │
                     │  POSTGRESQL 15       │   │  DIRECTORY (Azure AD) │
                     │  (Primary Database)  │   │  (Identity Provider)  │
                     └──────────────────────┘   └───────────────────────┘
```

---

## 2. Technology Stack

### 2.1 Frontend: React 18 + TypeScript + Vite + Tailwind CSS

**React 18** was selected as the frontend framework for its industry-leading component model, extensive ecosystem, and strong enterprise adoption. React 18's concurrent rendering features provide smooth user interactions even under load, which is important for users on standard corporate hardware. The component-based architecture enables reuse of UI elements (dashboards, course cards, progress indicators) across the application.

**TypeScript** adds static typing to JavaScript, catching errors at compile time rather than runtime. For an enterprise application handling compliance-critical data, TypeScript's type safety reduces the likelihood of data handling bugs and makes the codebase more maintainable for teams over time.

**Vite** replaces Create React App as the build toolchain. Vite's native ES module-based development server provides significantly faster hot module replacement (HMR) during development and optimized production builds through Rollup. Build times are typically 5–10x faster than webpack-based tooling.

**Tailwind CSS** provides a utility-first CSS framework that enables rapid, consistent UI development without maintaining a separate CSS architecture. Tailwind's purge capability ensures production bundles contain only the CSS classes actually used, minimizing bundle size.

### 2.2 Backend: Node.js + Express + TypeScript

**Node.js** (version 20 LTS) provides the runtime environment. Node.js's event-driven, non-blocking I/O model is well-suited to an API that handles many concurrent connections — particularly important for a platform that may send batch notifications or process large phishing simulation result sets simultaneously.

**Express** is the routing and middleware framework. Its minimalist design, extensive middleware ecosystem, and universal familiarity among Node.js developers make it the pragmatic choice for building structured RESTful APIs. Express middleware enables clean separation of concerns: authentication, logging, rate limiting, input validation, and error handling are each implemented as discrete middleware layers.

**TypeScript** on the backend mirrors the frontend choice, enabling full-stack type sharing (shared interfaces for API request/response types) and consistent code quality standards across the application.

### 2.3 Database: PostgreSQL 15

**PostgreSQL 15** was selected over alternatives for several reasons:

- **ACID compliance:** All user progress, compliance records, and audit logs require transactional integrity. PostgreSQL's ACID guarantees ensure that a course completion event is either fully recorded or not at all — never partially.
- **JSON support:** PostgreSQL's native JSONB support enables flexible storage of course content metadata and simulation configuration without sacrificing query performance.
- **Audit capabilities:** PostgreSQL's row-level security, trigger support, and extensive logging facilitate the detailed audit logging required for compliance frameworks.
- **Azure managed service:** Azure Database for PostgreSQL Flexible Server provides automated backups, point-in-time restore, high availability with standby replica, and automated patching without requiring dedicated DBA resources.
- **Performance:** PostgreSQL 15's improved query planner, parallel query execution, and connection pooling support (via PgBouncer) handle the concurrent read workloads typical of a reporting-heavy compliance platform.

### 2.4 Authentication: Microsoft Azure AD SSO + JWT

**Azure Active Directory (Azure AD / Microsoft Entra ID)** provides Single Sign-On via the OAuth 2.0 Authorization Code Flow with PKCE. This eliminates a separate credential store, leverages the organization's existing MFA policies, and provides automatic deprovisioning when users are disabled in Azure AD.

**JSON Web Tokens (JWT)** are used as the bearer token format for API authentication. Access tokens have a 1-hour lifetime. Refresh tokens have a 7-day lifetime and are stored as HTTP-only, SameSite=Strict, Secure cookies to prevent JavaScript access and CSRF exploitation.

### 2.5 Hosting: Azure App Service + Azure Database for PostgreSQL

**Azure App Service (P2v3 tier)** hosts the backend API. App Service provides automatic load balancing, health checks, deployment slots for zero-downtime deployments, integrated Application Insights telemetry, and managed TLS certificates.

**Azure Database for PostgreSQL Flexible Server (General Purpose, 4 vCores)** provides the managed database tier. High availability mode is enabled with a standby replica in a separate availability zone, providing automatic failover in under 60 seconds.

### 2.6 CDN: Azure CDN for Static Assets

Azure CDN (Standard tier, Microsoft network) serves the compiled React SPA and all static assets (images, fonts, course media) from edge nodes geographically distributed to minimize latency for users across multiple BPO sites. CDN caching rules distinguish between versioned static assets (long TTL) and the application's `index.html` (no-cache, ensuring users always receive the latest deployment).

### 2.7 Email: Microsoft Exchange Online / Office 365 SMTP

Email notifications (training assignments, reminders, certificates, phishing simulation results) are delivered through Microsoft Exchange Online using authenticated SMTP relay. This leverages the organization's existing M365 tenant, ensuring emails are delivered from a trusted organizational domain with valid SPF, DKIM, and DMARC records — improving deliverability and authenticity.

---

## 3. Component Diagram Description

The application is composed of the following major components:

**Frontend Components:**
- `AuthProvider` — Manages Azure AD MSAL authentication state, token refresh, and session lifecycle
- `Dashboard` — Employee-facing home screen showing Security Score, assigned courses, badges, and alerts
- `CoursePlayer` — Module-level content renderer supporting video, slides, and interactive scenarios
- `QuizEngine` — Assessment component with configurable question types, pass thresholds, and retry logic
- `PhishingResults` — Employee-facing educational content shown post-simulation-click
- `AdminConsole` — Multi-section admin interface (Users, Courses, Campaigns, Reports, Settings)
- `ComplianceDashboard` — Real-time compliance metrics with drill-down by department, role, and individual
- `ReportExporter` — PDF/CSV report generation triggered from the compliance dashboard

**Backend Components:**
- `AuthMiddleware` — JWT validation, role extraction, and request context population
- `UserService` — User CRUD, Azure AD sync, role assignment, and CSV import
- `CourseService` — Course and module management, content delivery, progress tracking
- `EnrollmentService` — Training assignment, progress tracking, completion recording, certificate issuance
- `QuizService` — Assessment delivery, scoring, attempt tracking, and pass/fail determination
- `PhishingService` — Campaign creation, link generation, click tracking, and result aggregation
- `ComplianceService` — Score calculation, report generation, and KPI aggregation
- `NotificationService` — Email dispatch and Teams webhook delivery
- `AuditService` — Structured audit log recording for all security-relevant events
- `GraphSyncService` — Scheduled Azure AD user synchronization via Microsoft Graph API

---

## 4. Data Flow Diagrams

### 4.1 User Login Flow (Azure AD SSO)

```
User Browser          Frontend (SPA)         Azure AD              Backend API
     │                      │                    │                      │
     │─── Visit app ────────▶│                    │                      │
     │                      │──── Check auth ────▶│                      │
     │                      │◀─── Not auth'd ─────│                      │
     │◀─── Redirect ─────────│                    │                      │
     │─── Login (M365 creds) ─────────────────────▶│                      │
     │◀─────────────── Auth code ─────────────────│                      │
     │─── Return with code ──▶│                    │                      │
     │                      │──── Exchange code ──▶│                      │
     │                      │◀─── ID token + AT ──│                      │
     │                      │──────────────────────────── POST /auth/login ▶│
     │                      │                    │   (Azure ID token)    │
     │                      │                    │                      │── Validate token
     │                      │                    │                      │── Issue JWT (1hr)
     │                      │◀──────────────────────────── JWT + refresh │
     │◀─── Load dashboard ───│                    │                      │
```

### 4.2 Course Completion Flow

```
Employee               Frontend              Backend API            PostgreSQL
    │                     │                      │                       │
    │─ Complete module ──▶│                      │                       │
    │                     │── POST /progress ───▶│                       │
    │                     │   {userId, moduleId, │                       │
    │                     │    score, timestamp} │                       │
    │                     │                      │── BEGIN TRANSACTION   │
    │                     │                      │── INSERT progress ───▶│
    │                     │                      │── UPDATE enrollment ─▶│
    │                     │                      │── Award points ──────▶│
    │                     │                      │── Check completion ───│
    │                     │                      │   (all modules done?) │
    │                     │                      │── Issue certificate ──▶│
    │                     │                      │── COMMIT              │
    │                     │◀── 200 + badge data ─│                       │
    │◀── Badge animation ─│                      │                       │
    │◀── Certificate link ─│                     │                       │
    │                     │                      │── Queue email notif.  │
```

### 4.3 Phishing Simulation Click Flow

```
Employee Email         Phishing URL           Backend API          Frontend (SPA)
      │                    │                       │                     │
      │── Clicks link ────▶│                       │                     │
      │                    │── GET /p/{trackId} ──▶│                     │
      │                    │                       │── Log click event   │
      │                    │                       │── Record timestamp  │
      │                    │                       │── Flag user         │
      │                    │                       │── Queue alert email │
      │                    │◀── 302 Redirect ───────│                     │
      │◀─────────────────────────────────────────── Education page ──────│
      │                                                                  │
      │   [Employee sees immediate educational content about the phish]  │
```

---

## 5. Security Architecture

CyberShield implements a defense-in-depth security model with controls at every architectural layer:

**Network Layer:** Azure DDoS Protection Standard, Azure Web Application Firewall (WAF) with OWASP CRS 3.2 rule set, TLS 1.3 enforced at the CDN/Front Door layer with TLS 1.0/1.1 disabled.

**Application Layer:** JWT authentication on all API routes, RBAC enforcement at the controller level, rate limiting (express-rate-limit), security headers via Helmet.js, input validation via Zod schema validation, parameterized queries via pg library, Content Security Policy (CSP) headers, and CORS restricted to the application origin.

**Data Layer:** Encryption at rest (AES-256) managed by Azure for all database storage. Column-level encryption for highly sensitive fields (PII). Row-level security in PostgreSQL ensuring users can only query their own records. Connection pooling via PgBouncer.

**Identity Layer:** Azure AD MFA enforcement, Conditional Access policies, and short-lived JWT access tokens with secure refresh token rotation.

See `/docs/SECURITY_ARCHITECTURE.md` for the comprehensive security architecture specification.

---

## 6. Network Architecture

```
Internet
   │
   ▼
Azure Front Door (global load balancer + WAF + CDN)
   │
   ├──▶ Azure Static Web Apps (React SPA)
   │       └── Azure CDN (static assets, media files)
   │
   └──▶ Azure App Service (Node.js API)
           │    [Virtual Network Integration]
           │
           ├──▶ Azure Database for PostgreSQL
           │       (Private Endpoint — not internet-accessible)
           │
           ├──▶ Azure Active Directory (Microsoft Entra ID)
           │       (via Microsoft Graph API)
           │
           └──▶ Microsoft Exchange Online
                   (SMTP relay — port 587, STARTTLS)
```

The backend App Service is integrated with an Azure Virtual Network. The PostgreSQL database is accessed exclusively via Private Endpoint — it has no public IP address and is not reachable from the internet. All database traffic traverses the private VNet, never the public internet.

---

## 7. Scalability Approach

**Horizontal Scaling:** Azure App Service is configured with auto-scale rules that add instances when average CPU exceeds 70% for 5 minutes or when HTTP request queue depth exceeds 100. The application is stateless by design — no server-side session state, all state in the database or client-side JWT — enabling seamless horizontal scaling.

**Connection Pooling:** PgBouncer is deployed as a sidecar proxy on the App Service, maintaining a pool of database connections. This prevents connection exhaustion under high load, as each App Service instance does not need to maintain its own dedicated database connections.

**Database Read Replicas:** Azure Database for PostgreSQL supports read replicas. Reporting queries (compliance dashboards, bulk export) are routed to the read replica to prevent reporting workloads from impacting transactional operations.

**Caching:** Redis Cache (Azure Cache for Redis, C1 tier) caches frequently accessed, infrequently changing data: course catalog, department list, compliance score aggregations. Cache TTLs are set per data type, with compliance scores refreshed every 15 minutes and course catalog cached for 1 hour.

---

## 8. Backup and Disaster Recovery

**Database Backups:**
- Automated backups enabled on Azure Database for PostgreSQL with 35-day retention
- Point-in-time restore available to any point within the retention window (granularity: 5 minutes)
- Geo-redundant backup storage ensures backup availability even if the primary region is unavailable
- Weekly backup verification: automated restore test to a separate resource group confirms backup integrity

**Application Backups:**
- Infrastructure-as-Code (Bicep templates) stored in version control enables full environment rebuild within 4 hours
- Database schema migrations versioned in source control
- Static assets backed up via Azure Blob Storage with geo-redundant storage (GRS)

**Recovery Time / Recovery Point Objectives:**
- Recovery Time Objective (RTO): 4 hours (full environment rebuild)
- Recovery Point Objective (RPO): 5 minutes (last database backup point)
- For High Availability mode (recommended for production): automatic failover to standby replica within 60 seconds, effectively RTO < 2 minutes

---

## 9. Microsoft 365 Integration Details

### 9.1 Azure AD Single Sign-On
CyberShield registers as an Azure AD App Registration with the following configuration:
- Authentication: OAuth 2.0 Authorization Code Flow with PKCE
- Token type: ID token (user profile) + Access token (Graph API)
- Required permissions: `User.Read`, `User.ReadBasic.All`, `Group.Read.All` (for department sync)
- Redirect URIs: Application URL and localhost (development only)
- Token lifetime: configured via Azure AD token lifetime policies (access: 1 hour, refresh: 7 days)

### 9.2 Microsoft Graph API User Sync
A scheduled job runs every 4 hours to synchronize the CyberShield user directory with Azure AD:
- New users added in Azure AD are automatically provisioned in CyberShield with appropriate role
- Disabled/deleted users in Azure AD are automatically deactivated in CyberShield, revoking all active sessions
- Department and manager attributes are synchronized to maintain accurate organizational hierarchy for reporting
- Graph API calls use the application permission flow (client credentials) via a dedicated service principal with minimum necessary permissions

### 9.3 Teams Notifications via Webhook
Microsoft Teams notifications are delivered via Incoming Webhooks configured on the organization's designated security channel:
- Security alert notifications (phishing simulation results, overdue training escalations) are formatted as adaptive cards
- Individual employee notifications are delivered via Teams direct message using the Graph API `chatMessage` resource
- The Teams integration is optional and configurable per channel and notification type from the admin console

### 9.4 Microsoft Intune Integration
CyberShield checks device compliance status via the Microsoft Graph API `deviceCompliancePolicies` resource:
- Devices enrolled in Intune and marked non-compliant can be flagged in the CyberShield user dashboard
- Non-compliant device status can optionally trigger mandatory remediation training assignment
- Device compliance data is displayed on the admin console security overview but is read-only (CyberShield does not modify Intune policies)

---

## 10. API Design Principles

**RESTful Resource Design:** API endpoints follow REST conventions with noun-based resource paths (`/api/v1/users`, `/api/v1/courses`, `/api/v1/enrollments`). HTTP verbs map to CRUD operations semantically.

**Versioning:** All API routes are prefixed with `/api/v1/`. Future breaking changes will be introduced under `/api/v2/` with a defined deprecation period. The version is also included in the `API-Version` response header.

**Rate Limiting:** Global rate limiting of 1,000 requests per 15-minute window per IP address (configurable). Authentication endpoints are more restrictively limited to 20 requests per 15 minutes per IP to prevent credential stuffing.

**Error Responses:** All errors return a consistent JSON body: `{ "error": { "code": "RESOURCE_NOT_FOUND", "message": "...", "requestId": "uuid" } }`. The `requestId` correlates to Application Insights telemetry for troubleshooting.

**Pagination:** All collection endpoints support cursor-based pagination with `limit` (max 100) and `cursor` query parameters. Response includes `nextCursor` for retrieving subsequent pages.

**Idempotency:** POST endpoints that create resources accept an `Idempotency-Key` header. Duplicate requests with the same key within 24 hours return the original response without creating duplicate records.

---

## 11. Project Folder Structure

```
cybershield-lms/
├── frontend/                    # React 18 + TypeScript SPA
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── auth/            # Authentication components (LoginButton, ProtectedRoute)
│   │   │   ├── courses/         # Course player, module list, progress bar
│   │   │   ├── dashboard/       # Employee and admin dashboards
│   │   │   ├── phishing/        # Simulation results, educational content
│   │   │   ├── reports/         # Compliance charts, KPI cards, exporters
│   │   │   └── ui/              # Generic UI primitives (Button, Modal, Table)
│   │   ├── pages/               # Route-level page components
│   │   ├── hooks/               # Custom React hooks (useAuth, useCourses, useCompliance)
│   │   ├── services/            # API client layer (axios-based)
│   │   ├── store/               # Zustand global state management
│   │   ├── types/               # Shared TypeScript interfaces and enums
│   │   └── utils/               # Date formatting, score calculations, validators
│   ├── public/                  # Static files (favicon, robots.txt)
│   └── vite.config.ts           # Vite configuration
│
├── backend/                     # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── controllers/         # Request handlers (thin — delegate to services)
│   │   ├── services/            # Business logic (UserService, CourseService, etc.)
│   │   ├── repositories/        # Data access layer (SQL queries via pg)
│   │   ├── middleware/          # Auth, rate-limit, validation, error-handler
│   │   ├── routes/              # Express router definitions
│   │   ├── integrations/        # Azure AD, Graph API, Teams, Intune clients
│   │   ├── jobs/                # Scheduled jobs (user sync, reminder emails)
│   │   ├── types/               # TypeScript types and interfaces
│   │   └── utils/               # Helpers (logger, crypto, email templates)
│   └── tsconfig.json
│
├── database/
│   ├── schema.sql               # Full database schema (tables, indexes, constraints)
│   ├── seed.sql                 # Initial seed data (admin user, default courses)
│   └── migrations/              # Versioned migration scripts (V001__initial.sql, etc.)
│
├── docs/                        # All documentation (this directory)
│   ├── policies/                # Security policy documents
│   └── *.md                     # Architecture, deployment, admin, user guides
│
├── infrastructure/
│   ├── bicep/                   # Azure Bicep IaC templates
│   └── scripts/                 # Deployment and maintenance scripts
│
└── .github/
    └── workflows/               # CI/CD GitHub Actions pipelines
```

---

*For security questions regarding this architecture, contact the Information Security team. This document should be reviewed and updated with each major platform version release.*
