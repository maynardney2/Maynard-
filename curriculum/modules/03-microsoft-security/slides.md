# Microsoft 365 Security Awareness — Full Slide Curriculum

---

## Course 1: Safe Use of Microsoft 365 & Teams

### Module 1: Microsoft 365 Security Overview

**Slide 1: Why Microsoft 365 Security Matters**
Content:
- Your Microsoft 365 account is the keys to the kingdom — email, files, meetings, and identity
- A compromised M365 account gives attackers access to client emails, SharePoint data, and Teams chats
- BPO organizations are high-value targets because M365 accounts hold sensitive client data
- 85% of cloud account breaches in BPOs involve Microsoft 365 credentials
- Understanding M365 security features is part of your job responsibility

Speaker Notes: Open with a real statistic — in 2023, over 1.5 million Microsoft 365 accounts were compromised through phishing alone. Emphasize that their M365 account is not just an email tool — it holds client records, contracts, and communications.

---

**Slide 2: Your Microsoft 365 Security Baseline**
Content:
- Enable Multi-Factor Authentication (MFA) on your account — your IT team manages this
- Use a strong, unique password (managed through Azure AD policies)
- Sign out of M365 on shared or personal devices when done
- Recognize the official Microsoft 365 login URL: login.microsoftonline.com
- Never save your M365 password in a browser on a non-company device

Speaker Notes: Walk through what the official login page looks like vs. a phishing page. Demonstrate the difference in URLs — microsoft.com vs. micros0ft-login.com.

---

**Slide 3: Microsoft Teams — Collaboration Security**
Content:
- Teams is a primary communication tool — treat it like email for data handling purposes
- Do not share client data, PII, or confidential files in personal Teams chats
- Use approved Teams channels for client work — not DMs on personal Microsoft accounts
- External guest access in Teams can expose your conversations — verify who is in the meeting
- Check for the "External" label next to any participant you do not recognize

Speaker Notes: Scenario: An employee shares a client's data in a Teams DM with a colleague. That colleague has external guest access from a personal account. The data is now outside your security boundary. This happens more than people realize.

---

**Slide 4: Data Classification in Teams**
Content:
- Classify your Teams messages: Public, Internal, Confidential, Restricted
- Do not discuss Restricted (client PII, financial data) information in general Teams channels
- Use Microsoft Information Protection (MIP) sensitivity labels when sharing files
- Approved use: project coordination, internal meetings, support queries
- Not approved: sending client database extracts, sharing credentials, storing personal data

Speaker Notes: Your IT team has configured sensitivity labels in your tenant. Walk employees through how to apply a label when sharing a file in Teams.

---

**Slide 5: Module Quiz — Teams Security**
*[Quiz card: Which of the following is a security risk in Microsoft Teams?]*
- A) Using Teams for internal project coordination
- B) Adding an unverified "External" attendee to a client review call ✓
- C) Applying a "Confidential" sensitivity label to a shared file
- D) Using Teams channels for team announcements

---

### Module 2: Email Security in Microsoft 365

**Slide 1: Microsoft Outlook — Your Phishing Frontline**
Content:
- Outlook is the #1 entry point for cyberattacks in most organizations
- Microsoft 365 Defender automatically scans attachments and links — but it is not perfect
- The "Report Phishing" button in Outlook sends suspected emails directly to Microsoft and your IT team
- Safe Links rewrites URLs to check them before you visit — do not disable this feature
- Safe Attachments detonates suspicious files in a sandbox — trust it

Speaker Notes: Show employees where the "Report Phishing" add-in is in their Outlook toolbar. This single action helps protect the entire organization.

---

**Slide 2: How to Spot Phishing in Outlook**
Content:
- Check the sender's actual email address — not just the display name
- Look for the "External" banner that appears on emails from outside your organization
- Hover over links before clicking — the real URL appears in the status bar
- Be suspicious of urgency: "Act now," "Account will be suspended," "Final warning"
- Microsoft will never ask for your password via email

Speaker Notes: Live demonstration: In Outlook, right-click a sender's name and select "Open Contact Card" to reveal the real email address. Show the difference between a display name and actual address.

Scenario: You receive an email from "IT Security Team" with display name — but the actual address is it-security@company-helpdesk.net (not your real domain).

---

**Slide 3: Sensitive Email Handling**
Content:
- Apply sensitivity labels to emails containing client data: Confidential or Restricted
- Do not forward client emails to personal email addresses (Gmail, Yahoo, etc.)
- BCC is not a security control — do not use BCC to hide recipients from management
- Encrypted email (S/MIME or Microsoft Purview Message Encryption) must be used for Restricted data
- Reply-all on large distribution lists can expose confidential information broadly

Speaker Notes: Policy reminder: Forwarding work emails to personal accounts is a policy violation and may breach client contracts. This applies even when working from home.

---

**Slide 4: Email Attachments — The Malware Highway**
Content:
- Malicious Office documents (Word, Excel, PowerPoint) can contain hidden macros
- Never enable macros unless you are certain the file is from a trusted, verified source
- Compressed (.zip, .rar) files with executable (.exe, .bat, .ps1) content are dangerous
- PDF files can contain malicious JavaScript — Outlook's Safe Attachments helps, but not always
- When in doubt, use an online sandbox (ask IT for options) before opening

Speaker Notes: Macro-enabled Office documents were responsible for 38% of malware deliveries in 2023. "Enable Content" pop-ups in Excel or Word are a major red flag for any unexpected document.

---

## Course 2: OneDrive & SharePoint Security

### Module 1: Cloud Storage Security Principles

**Slide 1: OneDrive — Your Secure Personal Storage**
Content:
- OneDrive is your company-managed personal cloud storage — backed up, secured, and audited
- Files in OneDrive are encrypted at rest and in transit by Microsoft
- Your IT team can audit who has accessed your OneDrive files — it is not private personal storage
- Do not store personal (non-work) data in OneDrive — it falls under company data policies
- OneDrive syncs to your device — if your device is compromised, so is what is synced

Speaker Notes: Clarify the difference between personal OneDrive (personal Microsoft account) and business OneDrive (managed by company). Employees should never mix them.

---

**Slide 2: SharePoint — Collaboration with Controls**
Content:
- SharePoint team sites are shared spaces — every file you upload is visible to site members
- Apply sensitivity labels to SharePoint libraries containing confidential data
- Avoid creating broad "Everyone" sharing links — use specific person or group sharing
- SharePoint has version history — deleted files are recoverable by IT for 93 days
- External sharing settings are controlled by IT — request permission for legitimate external collaboration

Speaker Notes: Scenario: An employee accidentally uploads a client's full customer database to the wrong SharePoint site — one accessible to 300 employees. Because SharePoint has audit logging, IT can identify who accessed the file and when. Version history allows IT to recover the original file.

---

**Slide 3: Sharing Links — The Biggest Risk**
Content:
- "Anyone with the link" = the most dangerous sharing option — avoid for confidential content
- "People in your organization" = appropriate for internal-only documents
- "Specific people" = most secure — use for client data and confidential reports
- Expiry dates on sharing links reduce risk — set them to 7-30 days for external shares
- Audit your shared files regularly — remove access when collaboration ends

Speaker Notes: Demonstrate in SharePoint: show the three sharing options and explain which is appropriate for each scenario. Make it a habit to review "Shared with" settings before sending any link.

---

**Slide 4: Data Loss Prevention (DLP) in SharePoint/OneDrive**
Content:
- Microsoft Purview DLP automatically detects and protects sensitive data (credit cards, SSNs, etc.)
- If a DLP policy blocks your action, it is for a reason — do not try to work around it
- DLP alerts notify your IT team of potential data leaks in real time
- Policy tip pop-ups in Office apps guide you toward compliant data handling
- Intentionally bypassing DLP controls is a serious policy violation

Speaker Notes: Show a real example of a DLP policy tip appearing when an employee tries to share a document containing a credit card number via email or OneDrive link.

---

## Course 3: Intune Device Management Awareness

### Module 1: Why Your Device is Managed

**Slide 1: What Is Microsoft Intune?**
Content:
- Microsoft Intune is a Mobile Device Management (MDM) and Mobile Application Management (MAM) solution
- It allows IT to manage security settings on your work device remotely
- Intune ensures your device meets company security standards before connecting to company resources
- Without compliance, Conditional Access blocks your access to M365 (email, Teams, files)
- Intune is standard in enterprise organizations — it is not monitoring your personal activity

Speaker Notes: Reassure employees that Intune does not read personal emails, photos, or personal app data. It enforces policies like screen lock, encryption, and OS updates. Employees often resist MDM — address this proactively.

---

**Slide 2: What Intune Manages on Your Device**
Content:
- Enforces screen lock/PIN/biometric requirements (after 5 minutes of inactivity)
- Requires BitLocker (Windows) or FileVault (Mac) encryption to be enabled
- Ensures your OS and apps are up-to-date (patch compliance)
- Can remotely wipe a lost or stolen device to protect company data
- Pushes approved apps via Company Portal — do not install apps outside the approved list

Speaker Notes: Scenario: An employee loses their laptop at an airport. IT receives an alert and remotely wipes the device within 30 minutes, preventing any data exposure. This is only possible because the device was enrolled in Intune.

---

**Slide 3: Conditional Access — Your Security Gate**
Content:
- Conditional Access evaluates every sign-in request before granting access
- It checks: Who are you? What device are you on? Where are you signing in from? What are you accessing?
- If your device is non-compliant (e.g., outdated OS, no encryption), access is blocked
- MFA may be required when signing in from new locations, unfamiliar devices, or outside business hours
- Never attempt to bypass Conditional Access policies — report issues to IT instead

Speaker Notes: Show the Conditional Access decision flow: Identity + Device + Location + Risk = Grant/Block/Require MFA. This is a zero-trust architecture concept — trust is earned, not assumed.

---

## Course 4: Conditional Access & Identity Security

### Module 1: Identity Is the New Perimeter

**Slide 1: Your Identity Is Your Security Perimeter**
Content:
- In a cloud-first world, your identity (credentials) is the primary attack target
- Attackers do not need to break into your network — they just need your username and password
- 81% of data breaches involve stolen or compromised credentials
- Zero-trust security model: never trust, always verify — every access request is challenged
- Protecting your identity is the single most important security action you can take

Speaker Notes: Classic network perimeter security (firewalls, VPNs) is no longer sufficient when everything is in the cloud. Identity-first security is the modern approach.

---

**Slide 2: Azure AD — Your Company Identity Provider**
Content:
- Azure Active Directory (Azure AD / Entra ID) manages all company identities and access
- Single Sign-On (SSO): one login unlocks all your M365 apps securely
- Privileged Identity Management (PIM): admin roles are activated on-demand, not persistent
- Azure AD tracks all sign-in activity — unusual logins trigger alerts and MFA challenges
- Reporting a suspicious sign-in you did not initiate is critical — call IT immediately

Speaker Notes: Show employees where to check their sign-in activity: MyAccount.microsoft.com → Sign-in activity. They can see every login, device, and location for their account.

---

**Slide 3: MFA — Your Identity's Second Lock**
Content:
- MFA requires: something you know (password) + something you have (phone/authenticator) + something you are (biometric)
- Microsoft Authenticator is the company-approved MFA method — more secure than SMS
- Never approve an MFA request you did not initiate — this is an MFA fatigue attack
- If your authenticator app asks you to "enter a number" (number matching), enter only the number shown on the login screen
- Report unexpected MFA prompts immediately to IT — someone has your password

Speaker Notes: MFA fatigue attacks: attackers get your password, then bombard your phone with MFA requests hoping you will approve one by mistake. The solution: always check the request details before approving.

---

**Slide 4: Safe Sign-in Practices**
Content:
- Always sign in at login.microsoftonline.com — bookmark it
- Never sign into M365 on untrusted, shared, or public computers
- Use the "Sign out" button when finished on any device — especially shared workstations
- Enable "Stay signed in only on trusted devices" — not on personal or public machines
- If you sign in on a new device, complete the MFA challenge and verify the device registration with IT

Speaker Notes: Scenario: An employee signs in to check their email on a hotel computer and forgets to sign out. Another user finds the session open and accesses company emails and files. Session management is critical.

---
