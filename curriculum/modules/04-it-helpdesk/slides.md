# IT & Helpdesk Security Awareness — Full Slide Curriculum

---

## Course 1: Privileged Account Management

### Module 1: The Power and Responsibility of Privileged Access

**Slide 1: What Is a Privileged Account?**
Content:
- Privileged accounts have elevated permissions beyond standard user access
- Types: Domain Admin, Local Admin, Service Accounts, Database Admin, Security Admin
- Privileged accounts are the primary target of advanced persistent threats (APTs)
- A compromised domain admin account can affect every system in the organization within minutes
- Principle of least privilege: grant only the minimum access needed to perform the job

Speaker Notes: Start with a real-world example — in the Target breach of 2013, attackers gained access through a vendor's HVAC system credentials, then moved laterally to payment systems using privileged access. The damage was 40 million card records stolen.

---

**Slide 2: Admin Account Separation — Use Two Accounts**
Content:
- IT staff must use a separate admin account for administrative tasks — never your daily user account
- Your regular account (@company.com) is for email, browsing, Teams
- Your admin account (adm.firstname@company.com or admin-firstname) is ONLY for admin tasks
- Never browse the internet, read email, or chat using your admin account
- This limits blast radius: if your user account is phished, admin access is not automatically compromised

Speaker Notes: Analogy: A locksmith does not carry the master key on their personal keyring. Admin accounts are tools, not everyday identities. Demonstrate the difference in practice — log into admin work on one session, regular work on another.

---

**Slide 3: Privileged Identity Management (PIM) — Just-In-Time Access**
Content:
- PIM allows admin roles to be activated on-demand for a limited time window (e.g., 1 hour)
- Request PIM elevation before performing admin tasks — it logs your intent and limits exposure
- All PIM activations require MFA and a business justification
- Time-limited access: even if your admin session is hijacked, it expires automatically
- PIM activation logs are reviewed regularly by the Security team — this is by design, not surveillance

Speaker Notes: Walk through the PIM activation workflow: user requests elevation → MFA challenge → approval (if required) → time-limited session → automatic expiry. This is a key Azure AD security feature.

---

**Slide 4: Service Accounts — The Forgotten Attack Vector**
Content:
- Service accounts run automated tasks: backups, sync jobs, monitoring agents
- They often have high privileges but are never changed, monitored, or reviewed
- Use Managed Service Accounts (MSAs) or Group Managed Service Accounts (gMSAs) where possible
- Never use human user accounts as service accounts — they mix human and machine identity
- Rotate service account passwords quarterly and after any staff change who knew the password

Speaker Notes: Service accounts are one of the most common lateral movement targets in ransomware attacks. Attackers find an old, never-rotated service account with domain admin rights and use it to compromise the entire environment.

---

**Slide 5: Credential Storage — Never Do This**
Content:
- NEVER store admin credentials in text files, Excel spreadsheets, or OneNote
- Use a company-approved Privileged Access Workstation (PAW) for admin tasks
- Use an enterprise Password Manager or CyberArk/BeyondTrust for privileged credential storage
- Never share admin passwords in email, Teams messages, or ticketing system notes (visible to many)
- Rotate any credential that was shared in plain text immediately

Speaker Notes: Real scenario: An IT technician stores all admin passwords in a shared OneNote notebook "for convenience." A threat actor compromises one regular user's account, finds the OneNote, and has all admin credentials in plain text. Full environment compromise follows.

---

## Course 2: Identity Verification & Ticket Security

### Module 1: Verifying Who You Are Helping

**Slide 1: Social Engineering Targeting IT Helpdesk**
Content:
- IT Helpdesk is the #1 social engineering target in most organizations
- Attackers impersonate employees to get password resets, account unlocks, or MFA bypass
- The $25 million MGM Resorts breach (2023) started with a 10-minute call to their IT helpdesk
- A convincing voice and some LinkedIn research is all it takes to fool an unprepared analyst
- Your identity verification process is your organization's front-line defense

Speaker Notes: The MGM breach is a powerful recent example. Attackers called the helpdesk, impersonated an employee, and convinced the analyst to reset MFA on a privileged account. The resulting ransomware attack cost over $100 million. This reinforces why verification procedures are non-negotiable.

---

**Slide 2: The Identity Verification Protocol**
Content:
- Step 1: NEVER take action based on caller ID alone — it can be spoofed
- Step 2: Ask for Employee ID AND Department AND manager's name — cross-reference in the system
- Step 3: For high-risk requests (password reset, MFA change, privilege escalation): callback verification required
- Step 4: Call back the employee on their registered work number from your HR system — not the number they gave you
- Step 5: Document every step of the verification in the ticket

Speaker Notes: Roleplay this process with the class. One analyst plays the caller trying to social engineer a password reset. The other follows the verification protocol. Practice builds muscle memory for the real situation.

Scenario: Caller says: "Hi, I'm Sarah from the executive team, VP of Operations. I'm at the airport and I've been locked out of my account. I have a board presentation in 2 hours. Can you just reset my password?" — Walk through the correct response.

---

**Slide 3: High-Risk Requests — Extra Verification Required**
Content:
- Password reset: require callback + supervisor approval for C-level and IT accounts
- MFA reset/bypass: this is the highest-risk action — requires in-person verification or senior approval
- Permission escalation: document business justification and manager approval in writing
- Remote access grant: verify with both the user and their manager
- If you feel pressured or rushed, slow down — that urgency is a social engineering technique

Speaker Notes: Create a laminated "High-Risk Request Checklist" for helpdesk workstations. Make the verification process a documented standard, not a judgment call. Standardization removes individual pressure.

---

**Slide 4: Ticket Security Best Practices**
Content:
- Never include passwords, even temporary ones, in ticket notes — use secure vaults
- Mark tickets containing sensitive details as "Restricted" in the ticketing system
- Avoid sharing ticket URLs with requesters — use the system's secure notification
- Regularly review open tickets for stale access requests that were never revoked
- Archive tickets with PII after 30 days per data retention policy

Speaker Notes: Ticketing systems are often overlooked as a data security risk. A misconfigured Jira/ServiceNow instance exposed thousands of tickets containing credentials at multiple companies. Treat your ticketing system as a sensitive data store.

---

## Course 3: Secure Remote Support Practices

### Module 1: Remote Support Security

**Slide 1: Remote Support Tools — Power and Risk**
Content:
- Remote support tools (TeamViewer, AnyDesk, ConnectWise) give full control of an employee's device
- Attackers impersonate IT and instruct employees to install remote support tools
- Approved tools: only company-managed remote support software installed via Intune
- Never allow anyone who calls you unexpectedly to install remote access software
- All remote sessions should be recorded and logged for audit purposes

Speaker Notes: Tech support scams: Employees receive pop-ups saying "Your computer is infected — call Microsoft at 1-800-XXX-XXXX." They call, and the "technician" directs them to install AnyDesk and grant full control. This is the most common tech support scam vector.

---

**Slide 2: Conducting Secure Remote Sessions**
Content:
- Always authenticate the user before connecting — verify their identity first
- Request only the minimum screen sharing needed (window vs. full screen)
- Never ask users to type passwords while you can see the screen — look away or disconnect view
- Terminate the session immediately when the task is complete — do not leave open sessions
- Inform the user what actions you will take before you perform them

Speaker Notes: Privacy and trust: Users should feel in control during remote sessions. IT staff who behave transparently build trust. Sneaking around the file system or reading emails during a support session is a policy violation and grounds for disciplinary action.

---

**Slide 3: Least Privilege in Remote Support**
Content:
- Request temporary local admin rights via PIM for the duration of the task — not permanent elevation
- Use runas / sudo for specific elevated tasks rather than full admin shell
- Document all commands and actions taken during remote sessions in the ticket
- Disconnect from VPN admin channels when not actively performing admin work
- Avoid storing remote support session recordings on personal devices — use the IT share

Speaker Notes: Ransomware operators specifically target IT admin remote sessions. Leaving an RDP session open on an unattended workstation gives attackers a ready-made admin entry point.

---

## Course 4: Patch Management & Endpoint Security

### Module 1: Why Patching Is Your Most Important Security Task

**Slide 1: Unpatched Systems Are Open Doors**
Content:
- 60% of breaches in 2023 exploited known vulnerabilities that had available patches
- WannaCry ransomware (2017) exploited a Windows vulnerability patched 2 months earlier
- Attackers scan the internet for unpatched systems — this is automated and happens within hours of a CVE publication
- Every day a critical patch is unapplied is a day of unnecessary risk
- Patch management is not optional — it is a primary security control

Speaker Notes: The WannaCry story: Microsoft released patch MS17-010 in March 2017. WannaCry hit in May 2017 — just 59 days later. Organizations that had not patched were devastated, including the UK NHS (23 hospitals shut down). The patch was available and free.

---

**Slide 2: Understanding CVEs and Risk Scoring**
Content:
- CVE (Common Vulnerabilities and Exposures): a standardized identifier for publicly known vulnerabilities
- CVSS Score: rates severity 0-10 (Low / Medium / High / Critical)
- Critical (9.0-10.0): patch within 24-72 hours in most organizations
- High (7.0-8.9): patch within 7 days
- Medium (4.0-6.9): patch within 30 days
- Always check vendor advisories and CISA KEV (Known Exploited Vulnerabilities) list

Speaker Notes: Demonstrate how to read a CVE entry at nvd.nist.gov. Show CVSS scoring and what the attack vector, attack complexity, and impact fields mean in plain language. This helps IT staff prioritize correctly.

---

**Slide 3: Patch Management Process**
Content:
- Test patches in staging/UAT environment before deploying to production
- Communicate maintenance windows to affected teams at least 48 hours in advance
- Use Microsoft Endpoint Configuration Manager (MECM) or Intune for automated patching
- Track patch compliance: all endpoints must be patched within the defined SLA
- Emergency patching (zero-day/critical exploitation): abbreviated testing, deploy within 24 hours with change approval

Speaker Notes: The patch management cycle: Identify vulnerability → Assess risk → Test patch → Schedule window → Deploy → Verify → Document. Each step has a defined SLA. Show your organization's current patch compliance dashboard.

---

**Slide 4: Endpoint Detection & Response (EDR)**
Content:
- EDR (e.g., Microsoft Defender for Endpoint, CrowdStrike) continuously monitors endpoint behavior
- Unlike antivirus, EDR detects behavioral anomalies: unexpected processes, lateral movement, data exfiltration
- IT staff should review EDR alerts daily — unresolved alerts are unresolved threats
- Never disable EDR agents even temporarily — escalate to security team if EDR causes issues
- Threat hunting: proactively search for indicators of compromise (IoCs) rather than waiting for alerts

Speaker Notes: Scenario: EDR flags an unusual PowerShell command running from a Word macro on an employee's workstation. The IT team investigates and finds a Qakbot infection that has not yet executed its payload. Because EDR caught it early, the attack was contained to one machine.

---
