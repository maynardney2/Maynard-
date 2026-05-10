# Core Cybersecurity Track — Slide Decks

> **Track:** Core Security | **Audience:** All Employees | **Required:** Yes

---

## Course: Password Security & MFA Essentials

**Duration:** 30 minutes | **Difficulty:** Beginner | **Passing Score:** 80%

---

### Module 1: Why Passwords Still Matter

---

**Slide 1: The Cost of a Weak Password**

Content:
- In 2023, over **80% of hacking-related breaches** involved compromised or weak credentials (Verizon DBIR 2023)
- Average cost of a credential-based breach: **$4.5 million USD**
- Attackers use automated tools that can test **billions of password combinations per second** using GPU-powered cracking rigs
- A simple 8-character password using only lowercase letters has roughly **200 billion combinations** — crackable in under 5 minutes with modern hardware
- Your work account gives attackers access to client data, financial systems, and your colleagues' information — it is not just your account at risk

Speaker Notes: Open with a real-world example if possible — mention a well-known BPO data breach. The goal is to connect abstract statistics to the learner's own workplace. Emphasize that password security is not about being technically savvy; it is a habit anyone can build.

---

**Slide 2: How Attackers Steal Passwords**

Content:
- **Brute force attacks** — automated tools systematically try every combination of characters until a match is found
- **Dictionary attacks** — tools use lists of common words, names, and previously leaked passwords (rockyou.txt has 14+ million entries)
- **Credential stuffing** — attackers take username/password pairs leaked from one breach (e.g., a social media site) and try them on corporate systems
- **Phishing** — tricking users into typing their password into a fake login page (the #1 method used against BPO employees)
- **Keyloggers and malware** — malicious software silently records every keystroke on an infected device

Speaker Notes: The credential stuffing point resonates well with employees who reuse passwords across personal and work accounts. Ask learners to raise their hand (mentally) if they use the same password in more than one place — then explain why that single decision multiplies their risk.

---

**Slide 3: NIST Password Guidelines — What the Experts Say**

Content:
- **NIST Special Publication 800-63B** (the authoritative U.S. government standard) revised password guidance significantly in 2017 and 2024
- NIST no longer recommends **forced periodic password changes** — research showed this led to weak patterns (Password1 → Password2 → Password3)
- Passwords should be changed **only when there is evidence of compromise**, not on a fixed schedule
- **Minimum 8 characters** for user-chosen passwords; **15+ characters recommended** for highly sensitive systems
- Passwords should be checked against lists of known-compromised passwords (HIBP database, dictionary words, repetitive patterns)
- Complexity rules (uppercase + number + symbol) are less effective than **length** — a long passphrase beats a complex short password

Speaker Notes: Many learners will be surprised that the old forced-rotation rule is now considered bad practice. Use this to challenge the myth that frequent changes equal better security. The key message: length and uniqueness matter far more than complexity.

---

**Slide 4: The Passphrase — Your Best Defense**

Content:
- A **passphrase** is a sequence of random words used as a password: easier to remember, harder to crack
- Example — Weak: `Summer2024!` (11 chars, common pattern — crackable in hours)
- Example — Strong passphrase: `Velvet-Monsoon-Cactus-42` (24 chars — estimated billions of years to crack by brute force)
- A passphrase only works if the words are **randomly chosen** — avoid song lyrics, quotes, or personal information
- Use a **minimum of 4 random words** separated by hyphens, spaces, or numbers; add a random symbol or number for extra entropy
- CyberShield policy: all passwords must be **at least 14 characters** and cannot match any of your last 12 passwords

Speaker Notes: Have employees practice creating a passphrase using the Diceware method (rolling dice to pick words). It makes the concept tangible. Stress that the passphrase example given in training should never actually be used — it is now a known example.

> **Scenario Box:** Maria needs to create a new password for her CRM access. She picks `Maria1234!` because it is easy to remember. An attacker who found her name on LinkedIn could crack this in seconds with a targeted dictionary attack. Instead, Maria should use a passphrase like `Dolphin-Rainy-Fork-77` — just as memorable, exponentially harder to crack.

---

### Module 2: Multi-Factor Authentication (MFA)

---

**Slide 5: What is MFA and Why is It Non-Negotiable?**

Content:
- **Multi-Factor Authentication (MFA)** requires users to prove their identity using two or more of: something you **know** (password), something you **have** (phone or token), something you **are** (biometric)
- MFA blocks **99.9% of automated account attacks** even when a password is fully compromised (Microsoft Security Intelligence Report)
- In the BPO context: if an attacker steals your password via phishing, MFA is the last barrier before they access client data
- CyberShield requires MFA on all corporate accounts, VPN connections, and privileged systems — no exceptions
- Forgetting your MFA device is an inconvenience; a compromised account without MFA is a **compliance incident** with potential contract consequences

Speaker Notes: Address the common objection — "MFA is annoying." Acknowledge the friction, then redirect: the 5-second tap on your phone is vastly less painful than the process of responding to a data breach. Share the statistic that 99.9% of attacks are stopped — it is remarkably powerful.

---

**Slide 6: Types of MFA — Know the Differences**

Content:
- **SMS OTP (least secure):** A one-time code sent via text message. Vulnerable to SIM-swap attacks and SS7 interception. Acceptable, but avoid when stronger options exist
- **Authenticator App (recommended):** Apps like Microsoft Authenticator or Google Authenticator generate time-based OTPs (TOTP) locally on your device. Not interceptable over the network
- **Push Notification (convenient but watch for fatigue):** App sends an approve/deny prompt to your phone. Susceptible to MFA fatigue attacks if not used carefully — always check the context before approving
- **Hardware Token (most secure for admins):** Physical devices like YubiKey that generate or respond to challenge codes. Phishing-resistant. Required for all IT admin accounts at CyberShield
- **Biometrics (device-local):** Fingerprint and face ID unlock your device or confirm app actions. Biometric data stays on-device and is not transmitted to servers

Speaker Notes: Draw the spectrum from least to most secure. Many employees only know about SMS codes — expanding this vocabulary helps them understand why the company chose certain tools. For IT staff modules, the hardware token section will be expanded significantly.

---

**Slide 7: MFA Fatigue Attacks — The New Threat**

Content:
- **MFA fatigue** (also called MFA bombing or push notification spam) occurs when an attacker who has your password repeatedly sends MFA approval requests hoping you will tap "Approve" out of frustration or confusion
- Real incident: the 2022 Uber breach began when an attacker combined credential theft with MFA fatigue — the contractor eventually approved the request after being bombarded
- **How to defend yourself:** Never approve an MFA request you did not initiate. If you receive unexpected requests, change your password immediately and notify IT
- CyberShield's Microsoft Authenticator is configured with **number matching** — you must enter the number shown on your screen into the app. This eliminates blind approvals
- Report unexpected MFA requests to `security@cybershield.local` or via the IT helpdesk immediately

Speaker Notes: The Uber breach story is highly engaging because it shows how human psychology is exploited, not a technical flaw. Number matching is worth demonstrating live if possible — show learners exactly what the prompt looks like so they know what to expect.

---

### Module 3: Password Managers

---

**Slide 8: Why You Need a Password Manager**

Content:
- The average person has **100+ online accounts** — it is humanly impossible to remember unique, complex passwords for each
- Password managers generate, store, and auto-fill strong unique passwords for every account — you only need to remember **one master passphrase**
- Without a manager, employees resort to dangerous habits: password reuse, simple passwords, writing them in notebooks or spreadsheets
- CyberShield provides **all employees** with access to an enterprise password manager — using it is mandatory for all work accounts
- Password managers also warn you when your credentials appear in known data breaches (breach monitoring feature)

Speaker Notes: A common fear is "what if the password manager gets hacked?" Address this: password manager data is encrypted with your master password. Even if the server is breached, attackers cannot read your passwords without your master passphrase. This is fundamentally safer than a spreadsheet.

---

**Slide 9: Password Manager Dos and Don'ts**

Content:
- **DO** use the company-approved password manager for all work-related accounts
- **DO** set a strong, unique master passphrase (use the 4-random-word method)
- **DO** enable MFA on your password manager account — it is the key to all your keys
- **DON'T** store your master passphrase in the password manager itself or in a plaintext document
- **DON'T** share your password manager account with colleagues — each person must have their own account
- **DON'T** use your personal password manager for work accounts, or your work manager for personal accounts — keep them separate

> **Scenario Box:** Kevin needs to share a system credential with his teammate for a critical client task. Instead of texting the password, he uses the password manager's **secure sharing feature** — which grants time-limited access without revealing the actual password. When the task is done, he revokes access. No credential was ever transmitted in plaintext.

Speaker Notes: The scenario addresses a very common real-world situation in BPO environments where credential sharing feels necessary. Redirect to the correct behavior using the tool they have available.

---

**Slide 10: Module Summary & Quiz Preparation**

Content:
- Passwords are still the primary target of attackers — length and uniqueness beat complexity
- NIST no longer recommends forced periodic rotation — change passwords only when compromised
- Passphrases (4+ random words, 14+ characters) are the recommended approach at CyberShield
- MFA stops 99.9% of attacks — use authenticator apps, not SMS when possible; never blindly approve push notifications
- The company password manager is mandatory for all work accounts — one master passphrase, unlimited strong passwords
- **Your security score improves** when you enable MFA, complete this course, and pass the quiz with 80% or higher

Speaker Notes: Summarize the key takeaways and transition to the quiz. Remind learners that the quiz has three attempts allowed and covers material from all three modules. Reinforce that security is a shared responsibility — their choices protect not just themselves but every client whose data they touch.

---

## Course: Phishing & Social Engineering Defense

**Duration:** 35 minutes | **Difficulty:** Beginner | **Passing Score:** 80%

---

### Module 1: Understanding Phishing Attacks

---

**Slide 1: Phishing — The #1 Threat to BPO Organizations**

Content:
- **Phishing** is a cyberattack that uses deceptive messages to trick people into revealing credentials, clicking malicious links, or downloading malware
- Over **3.4 billion phishing emails** are sent every day globally (SlashNext, 2023)
- BPO organizations are **high-value targets** because agents have access to client data, financial accounts, and customer PII across multiple business domains
- **91% of all cyberattacks** begin with a phishing email (Deloitte)
- Unlike technical exploits that require finding software vulnerabilities, phishing exploits **human psychology** — no patch exists for curiosity, fear, or urgency

Speaker Notes: Reinforce why BPO employees specifically are targeted. Attackers know that a single compromised BPO agent account can provide access to dozens of client systems. This makes phishing awareness a core business protection measure, not just personal security advice.

---

**Slide 2: The Phishing Family — Types You Will Encounter**

Content:
- **Email phishing (most common):** Mass or targeted emails with malicious links or attachments
- **Spear phishing (most dangerous):** Highly personalized attacks using your name, job title, manager's name, and recent work context — often researched from LinkedIn and company websites
- **Whaling:** Spear phishing targeting executives; attackers study the CEO's communication style and decision-making authority
- **Smishing:** Phishing via SMS text message — "Your package delivery failed, click here" or "Your bank account has been flagged"
- **Vishing:** Voice phishing — phone calls impersonating IT support, bank fraud teams, or government agencies
- **Quishing:** Phishing via QR codes — malicious QR codes placed in offices, meeting rooms, or attached to documents

Speaker Notes: Learners often think phishing only means email. Expanding the definition to cover all these vectors prepares them for the full threat landscape. In a BPO environment, vishing (someone calling the helpdesk posing as an employee) is particularly relevant.

---

**Slide 3: The Anatomy of a Phishing Email**

Content:
- **Sender address:** Attackers spoof display names ("IT Helpdesk") while the actual email domain is fake. Check the full email address, not just the name
- **Subject line:** Creates urgency, fear, or curiosity — "URGENT: Your account has been locked," "You have a pending payment," "Someone shared a file with you"
- **Greeting:** Generic greetings ("Dear Employee," "Dear Customer") instead of your actual name suggest mass phishing. Note: spear phishing uses your name
- **Body content:** Contains pressure tactics, unusual requests, or instructions that bypass normal procedures
- **Links:** Hover over any link before clicking — the displayed text may say `microsoft.com` while the actual URL goes to `m1cr0soft-login.net`
- **Attachments:** Malicious files disguised as invoices, resumes, reports, or shipping notifications

Speaker Notes: Walk through a real (sanitized) phishing email on screen if possible. Point to each element and explain the tell. The link hover technique is one of the most practical skills learners can take away from this slide.

---

**Slide 4: BPO-Specific Phishing Scenarios**

Content:
- **Client account impersonation:** Email appearing to come from a major client asking agents to urgently update account credentials or access a new portal
- **HR and payroll lures:** Fake payslip notifications, bonus announcements, or benefits enrollment forms that harvest credentials
- **IT helpdesk impersonation:** Fake password expiry notices, MFA re-enrollment requests, or software update prompts
- **Shipping/logistics pretexts:** "Your company laptop shipment requires verification" — common during new equipment rollouts
- **Third-party vendor impersonation:** Attackers pose as Microsoft, Salesforce, Zoom, or other tools the company uses daily, mimicking their email templates

> **Scenario Box:** Rodel receives an email from "IT Support" saying his Microsoft 365 account will be suspended in 2 hours unless he clicks a link to verify his account. The email looks professional and includes the company logo. Rodel checks the sender address: `support@cybershield-itsecurity.net`. The company's actual domain is `cybershield.local`. This is a phishing attempt. Rodel should not click the link — he should forward the email to `security@cybershield.local` and delete it.

Speaker Notes: These BPO-specific scenarios help learners connect the training to their daily reality. Ask the group: "Have you received something like this recently?" Almost always, someone has.

---

### Module 2: Recognizing and Responding to Phishing

---

**Slide 5: The 5-Second Phishing Check**

Content:
- Before clicking any link or opening any attachment, take 5 seconds to ask these questions:
- **1. Was I expecting this email?** Unexpected messages from known contacts should raise suspicion — their account may be compromised
- **2. Does the sender address match the organization they claim to represent?** Check the full domain, not just the display name
- **3. Is there artificial urgency?** Legitimate organizations do not threaten immediate account suspension to rush you into clicking
- **4. Does the link destination match where it claims to go?** Hover over links on desktop; on mobile, long-press to preview the URL
- **5. Is the request unusual or does it bypass normal procedures?** Requests to transfer funds, share credentials, or install software via email are red flags

Speaker Notes: This checklist should become a reflex. Consider having learners memorize these 5 questions by repeating them aloud. The 5-second investment before clicking can prevent a major breach.

---

**Slide 6: Spotting Spoofed Domains — A Practical Guide**

Content:
- Attackers register domains that visually resemble legitimate ones — this is called **typosquatting** or **homograph spoofing**
- Common tricks: replacing `l` (lowercase L) with `1` (one) — `paypa1.com`; inserting extra letters — `microsofft.com`; using hyphens — `microsoft-login.com`; using subdomains — `login.microsoft.com.phishing-site.ru`
- **How to read a domain correctly:** The true domain is the portion **immediately before the final slash** — so in `login.microsoft.com.phishing-site.ru/verify`, the true domain is `phishing-site.ru`
- Look up suspicious domains: paste URLs into `virustotal.com` or use the built-in URL scanner in Microsoft Defender
- CyberShield's email gateway flags external emails with a banner — any email with the `[EXTERNAL]` banner requires extra scrutiny

Speaker Notes: Domain reading is a learnable skill that takes practice. If you have access to a screen, demonstrate the subdomain trick with a real URL. Seeing it explained visually makes it click for most learners.

---

**Slide 7: Reporting Phishing — Your Role in Collective Defense**

Content:
- **Reporting matters:** Every phishing report helps IT block the sending domain, protecting every other employee who might receive the same email
- **How to report at CyberShield:**
  - Use the **"Report Phishing" button** in Microsoft Outlook (installed on all company devices)
  - Forward the email as an attachment to `security@cybershield.local`
  - If you clicked a link or opened an attachment: **call the IT helpdesk immediately** at extension 5000 — do not wait
- **If you are unsure** whether something is phishing, report it anyway — IT would rather investigate a false alarm than miss a real attack
- **Never delete a suspected phishing email without reporting it** — the metadata in the email helps IT investigate the source

Speaker Notes: Normalize reporting. Employees sometimes fear they will "look stupid" for reporting a legitimate email. Emphasize that there is no penalty for false positives — but there is serious risk in staying silent about a real threat.

---

**Slide 8: What Happens After You Click**

Content:
- If you clicked a phishing link or opened a malicious attachment, act **immediately** — time matters
- **Step 1:** Disconnect your device from the network (disable Wi-Fi, unplug Ethernet) to stop malware from spreading
- **Step 2:** Do NOT turn off the computer — this preserves forensic evidence the IT team needs
- **Step 3:** Call IT helpdesk immediately: **ext. 5000** (do not use email — it may be compromised)
- **Step 4:** Change your password from a **different, clean device** before re-enabling network access
- **Step 5:** Do not attempt to clean the infection yourself — IT will image the device and restore from backup
- There is **no disciplinary action** for reporting that you clicked a phishing link. The only mistake that harms the company is silence.

Speaker Notes: The "no disciplinary action" statement is crucial for psychological safety. Employees who fear punishment are far less likely to report promptly. A fast report can contain a breach; a delayed one can cost millions. Make sure this message lands clearly.

---

### Module 3: Social Engineering Beyond Email

---

**Slide 9: The Psychology of Social Engineering**

Content:
- Social engineers exploit predictable human psychological responses rather than software vulnerabilities
- **Authority:** "I'm calling from Microsoft. I need remote access to fix a critical vulnerability on your machine."
- **Urgency/Scarcity:** "This must be done in the next 10 minutes or the client account will be terminated."
- **Reciprocity:** An attacker builds rapport over weeks before making a request — you feel obligated because they have "helped" you
- **Social proof:** "I already have approval from your manager — she said you would cooperate."
- **Liking:** Attackers research their targets and build connections based on shared interests found on social media
- The best defense is a **verification habit** — always verify identity through a trusted, independent channel before acting on unusual requests

Speaker Notes: These psychological levers are universal — they work on smart, experienced people as well as anyone else. Normalizing the fact that anyone can be socially engineered removes shame and encourages vigilance. Role-play examples work very well here.

---

**Slide 10: Vishing — When the Call Feels Real**

Content:
- **Vishing (voice phishing)** attackers impersonate IT support, HR, bank fraud teams, or government regulators
- Modern AI voice cloning can replicate a person's voice from a few seconds of audio — executives' public speeches and podcast appearances are training data
- **Red flags on a call:** Caller requests remote access to your computer; caller asks you to read out a one-time code or password; caller creates extreme urgency; you did not initiate the call
- **The correct response:** Politely say "I need to verify your identity through our official channel" and hang up. Call the person back using the number in the company directory — never the number they gave you
- **Real incident:** A finance employee transferred $243,000 after receiving a WhatsApp call that used an AI-cloned voice of the CFO giving wire transfer authorization

Speaker Notes: The AI voice cloning detail typically shocks learners. It shifts the conversation from "just be careful" to "have a verification process because you cannot trust your ears alone." The WhatsApp CFO impersonation story (a real 2024 incident) is memorable and helps the message stick.

---

## Course: Email Security & Safe Communication

**Duration:** 25 minutes | **Difficulty:** Beginner | **Passing Score:** 75%

---

### Module 1: Email Headers and Sender Verification

---

**Slide 1: Why Email Is the Primary Attack Surface**

Content:
- Corporate email is used for **virtually every business communication** — and attackers know this
- Every external email is a potential attack vector: malicious links, infected attachments, BEC fraud, and espionage
- Email protocols were designed in the 1970s **without security in mind** — the "From" field can be trivially forged
- Modern defenses (SPF, DKIM, DMARC) help, but are not universally enforced and can be bypassed
- Employee vigilance is the **last line of defense** — technical filters catch most malicious emails, but not all
- CyberShield processes an estimated **50,000+ emails per day** — attackers only need to succeed once

Speaker Notes: Set the stage for why email hygiene matters operationally, not just personally. Employees in BPO environments often have a high volume of external email from clients — this is exactly what attackers exploit, since "legitimate-looking external email" is the daily normal.

---

**Slide 2: Reading Email Headers — The Basics**

Content:
- Every email contains **headers** — metadata that shows the true path the message took from sender to inbox
- The visible "From" field is easy to forge; the **Received** header chain shows the real sending infrastructure
- **Key header fields to check:**
  - `From:` — the address displayed to you; can be forged
  - `Reply-To:` — if different from `From:`, replies go to the attacker's address
  - `Return-Path:` — where bounce messages go; reveals the true sending domain
  - `Received:` — a chain of server hops; the bottom entry is the originating server
- **How to view headers in Outlook:** Open the email → File → Properties → Internet headers
- A mismatch between the displayed `From` and the `Return-Path` domain is a strong indicator of spoofing

Speaker Notes: Most employees will never need to manually inspect headers, but understanding that they exist and can reveal the true origin empowers them to flag suspicious emails to IT. For IT staff, header analysis is a fundamental skill covered in depth in the IT track.

---

**Slide 3: Email Authentication Standards — SPF, DKIM, and DMARC**

Content:
- **SPF (Sender Policy Framework):** A DNS record that lists all servers authorized to send email for a domain. If an email claims to come from `bank.com` but comes from an unauthorized server, SPF fails
- **DKIM (DomainKeys Identified Mail):** The sending server adds a cryptographic signature to each email. The receiving server checks the signature against a public key in DNS — if it doesn't match, the email may have been tampered with
- **DMARC (Domain-based Message Authentication, Reporting & Conformance):** Builds on SPF and DKIM to tell receiving servers what to do with emails that fail authentication — quarantine them or reject them outright
- If an email in your inbox passed SPF, DKIM, and DMARC checks, it genuinely came from the stated domain — but **a legitimate-looking domain can still be phishing** (attackers register look-alike domains that pass all three checks)

Speaker Notes: Emphasize the last bullet — passing authentication checks is necessary but not sufficient. An email from `payr011.com` may be fully authenticated while still being a phishing site. Authentication confirms the sender's identity claim; it does not validate their intent.

---

### Module 2: Attachment and Link Safety

---

**Slide 4: Dangerous Attachment Types — Know Before You Open**

Content:
- **High-risk file types (never open without verification):**
  - `.exe`, `.msi`, `.bat`, `.cmd`, `.ps1`, `.vbs` — direct executable code
  - `.docm`, `.xlsm`, `.pptm` — Office files with macros enabled (the `m` suffix means macros)
  - `.iso`, `.img` — disk image files; can contain hidden executables and bypass email filters
  - `.lnk` — Windows shortcut files; often used to run hidden malware
  - `.zip` and `.rar` — often used to package malicious files and bypass scanning (especially password-protected archives)
- **Lower-risk but still verify:** `.pdf`, `.docx`, `.xlsx` — can still contain exploits; open in Protected View or use Safe Documents
- CyberShield's email gateway automatically strips `.exe`, `.bat`, `.ps1`, and `.vbs` attachments from all inbound email

Speaker Notes: The macro-enabled Office format issue (`.docm` vs `.docx`) is widely misunderstood. Make it concrete: "If Outlook asks you to Enable Macros when opening a Word file, always say No and report the file to IT." The ISO trick (bypasses many email filters) became extremely common in 2021-2023 malware campaigns.

---

**Slide 5: Safe Link Practices — Hover, Verify, Then Click**

Content:
- **Before clicking any link** in email, on the web, or in a document, hover your cursor over it and read the URL in the bottom status bar of your browser
- Legitimate company portals will always use `cybershield.local` or approved vendor domains listed in your intranet portal
- **Microsoft Office 365 Safe Links:** CyberShield has enabled Microsoft Defender Safe Links — all URLs in email are re-written to go through Microsoft's URL scanner before reaching your browser
- When Safe Links blocks a site and shows a red warning page — **stop and do not proceed.** Report the email to IT.
- On mobile devices: **long-press** a link to preview the URL before tapping it
- Never scan QR codes from emails or physical sources unless you can verify the destination URL first

Speaker Notes: Safe Links is your technical backstop but not infallible. Employees should know it exists (so they understand the `safelinks.protection.outlook.com` URLs they see) but should not rely on it exclusively. The QR code reminder is increasingly important as "quishing" attacks grow.

---

### Module 3: Business Email Compromise (BEC)

---

**Slide 6: What is Business Email Compromise?**

Content:
- **BEC** is a sophisticated scam where attackers impersonate executives, vendors, or business partners to trick employees into transferring money or sensitive data
- BEC caused **$2.9 billion in U.S. losses in 2023** (FBI Internet Crime Report) — more financial damage than ransomware
- Unlike phishing, BEC emails often contain **no malicious links or attachments** — they pass all technical filters and reach the inbox
- Common BEC scenarios in BPO environments:
  - Executive impersonation requesting urgent wire transfers
  - Vendor impersonation sending updated bank account details for invoice payments
  - HR impersonation requesting payroll direct deposit changes
  - Client impersonation requesting account data exports

Speaker Notes: The "no malicious content" nature of BEC makes it uniquely dangerous. Employees trained to look for links and attachments may drop their guard on a plain-text email from an apparent executive. Redirect attention to the **context and request** rather than just the technical content.

---

**Slide 7: BEC Red Flags and Verification Protocol**

Content:
- **Red flag indicators:**
  - Urgent request that bypasses normal approval processes
  - Request for secrecy: "Don't mention this to anyone yet"
  - Financial requests from executive email during unusual hours (evenings, weekends, holidays)
  - Vendor emails with updated banking information, especially close to payment dates
  - Reply-To address that differs from the From address
- **Verification protocol for any financial or sensitive data request via email:**
  1. Do NOT reply to the email — the attacker controls that inbox
  2. Call the requestor directly using the **company directory** number — not any phone number in the email
  3. Obtain manager approval following the standard financial authorization matrix
  4. Document the verification call in the transaction record

> **Scenario Box:** Mark in Finance receives an email from what appears to be the CEO asking for an urgent $47,000 wire transfer to a vendor before end of day. The CEO is supposedly traveling and cannot be reached by phone. The correct response: **do not process the transfer.** Call the CFO directly using the company directory, initiate the BEC response procedure, and forward the email to IT Security. The CEO's inability to be reached by phone is itself a red flag — BEC attackers manufacture unavailability to prevent verification.

Speaker Notes: Walk through the verification protocol step-by-step. Role-play the awkwardness of calling back to verify — acknowledge that it feels strange to question an apparent executive's instructions. Frame it as: "Our policy protects you from being held accountable for a fraudulent transfer."

---

**Slide 8: Safe Email Forwarding and Data Handling**

Content:
- **Never forward client data to personal email accounts** — this violates data protection agreements and company policy
- Before forwarding any email containing PII, financial data, or client information: verify the recipient is authorized to receive it
- **Encryption requirement:** Emails containing sensitive data sent outside the company domain must use Microsoft Purview Message Encryption (automatically triggered by DLP labels)
- **Auto-forward rules:** CyberShield blocks auto-forward rules to external domains at the email gateway level — if you need a legitimate forward, contact IT
- **Reply-all discipline:** Before hitting Reply All, verify that all recipients need the information. A common data leak vector is replying to a large distribution list with sensitive content

Speaker Notes: Auto-forward to personal email is one of the most common ways BPO employees accidentally (or deliberately) exfiltrate data. The policy point should be clearly understood: it is a contract-level violation, not just an IT policy.

---

## Course: Remote Work Security

**Duration:** 30 minutes | **Difficulty:** Intermediate | **Passing Score:** 80%

---

### Module 1: The Remote Work Attack Surface

---

**Slide 1: How Remote Work Changed the Security Perimeter**

Content:
- The traditional corporate security model assumed that everything inside the network perimeter was trusted; the perimeter was the firewall
- Remote work **dissolves this perimeter** — employees connect from home networks, coffee shops, and hotels using a mix of personal and corporate devices
- **New attack surfaces introduced by remote work:**
  - Home routers (often running outdated firmware with known vulnerabilities)
  - Personal devices used for work (no corporate endpoint protection)
  - Unsecured Wi-Fi networks
  - Blended personal/work browser sessions (saved credentials, session cookies)
  - Physical surveillance (shoulder-surfing in shared spaces)
- CyberShield operates under a **Zero Trust** model: no user or device is automatically trusted, regardless of network location

Speaker Notes: Many employees think being "on VPN" means they are safe. Clarify that VPN encrypts the tunnel but does not protect against threats originating from the employee's compromised home network or device. Zero Trust means continuous verification, not perimeter trust.

---

**Slide 2: VPN — What It Does and What It Doesn't**

Content:
- A **VPN (Virtual Private Network)** encrypts traffic between your device and the corporate network, preventing eavesdroppers on your local network from reading it
- **What VPN does:** Encrypts data in transit, hides your traffic from your ISP and local network, allows access to internal corporate resources
- **What VPN does NOT do:** Protect you from malware already on your device, secure connections you make outside the VPN tunnel (split-tunneling), or prevent phishing attacks
- CyberShield policy: VPN is **mandatory** for all access to internal systems, client databases, CRM, and any data classified as Confidential or above
- If VPN disconnects, your device should automatically block access to sensitive resources (**Always-On VPN** is enforced on company-managed devices)
- Never use personal VPN services on company devices — they create a competing tunnel that bypasses corporate security controls

Speaker Notes: Employees often conflate "I'm on VPN" with "I'm completely secure." The distinction between what VPN does and does not do is critical. The prohibition on personal VPN services surprises many — explain that personal VPNs route traffic through an unknown third-party server, creating a potential data exposure channel.

---

### Module 2: Home Network and Endpoint Security

---

**Slide 3: Hardening Your Home Network**

Content:
- Your home router is the gateway to everything on your home network — including your work computer when it connects remotely
- **Immediate actions to take:**
  - Change the default admin username and password on your router (defaults like `admin/admin` are in publicly available tables)
  - Update your router firmware — check your router's admin panel or manufacturer's website for updates
  - Enable WPA3 encryption (or at minimum WPA2-AES) — never use WEP or WPA (deprecated, easily cracked)
  - Disable WPS (Wi-Fi Protected Setup) — a known vulnerability in many routers
  - Consider enabling a **guest Wi-Fi network** to separate work devices from IoT devices (smart TVs, cameras, thermostats)
- CyberShield IT can provide guidance on router security — contact the helpdesk for a home network security checklist

Speaker Notes: Avoid technical jargon overload. The actionable items are what matter. The guest network separation point is worth emphasizing — an attacker who compromises a smart TV on the same network as a work laptop can potentially pivot to the work device.

---

**Slide 4: Protecting Your Work Endpoint**

Content:
- Company-issued devices have **Microsoft Intune (MDM) enrollment**, Microsoft Defender, full disk encryption (BitLocker), and automatic screen lock — these are non-negotiable and cannot be disabled
- If using a personal device under BYOD policy: the company's Intune Company Portal app must be installed; it enforces minimum security requirements without accessing personal data
- **Physical workstation rules for remote workers:**
  - Lock your screen whenever you step away (`Windows + L` or `Ctrl + Command + Q` on Mac)
  - Work in a private area where screens cannot be seen by others, including family members
  - Never allow family or friends to use a work computer for any reason
  - Shred or cross-cut shred any printed work documents before disposal
  - Use a privacy screen filter if working in a shared space (café, co-working space)

> **Scenario Box:** Ana works from home and sometimes uses her personal laptop for quick tasks when her work laptop's battery is flat. Her personal laptop has no endpoint protection, outdated Windows, and her teenage son has installed several games on it. Accessing client data from this laptop is a **serious policy violation** that could result in a data breach. Ana must request a spare work laptop charger from IT rather than compromise client data security.

Speaker Notes: The scenario reflects a common real-world justification. Address it directly: convenience does not justify the risk. IT's job is to make the secure option the easy option — frame the laptop charger solution as the help IT wants to provide.

---

**Slide 5: Public Wi-Fi — Never Trust, Always Verify**

Content:
- Public Wi-Fi at cafés, airports, hotels, and co-working spaces is fundamentally insecure
- **Evil twin attacks:** Attackers set up a Wi-Fi access point with the same name as the legitimate network (e.g., "Starbucks_WiFi"). Your device connects automatically, and all your traffic passes through the attacker's router
- **SSL stripping:** On unprotected networks, some attacks downgrade HTTPS connections to HTTP, allowing traffic inspection
- **CyberShield policy:** Never access company systems on public Wi-Fi without active VPN connection. No exceptions
- If you need to work in a public location: use your **mobile phone as a personal hotspot** instead of the venue's Wi-Fi — mobile data is significantly more secure than open Wi-Fi
- Disable **auto-connect** to known networks in your device's Wi-Fi settings to prevent automatic connection to evil twin networks

Speaker Notes: The mobile hotspot tip is practical and actionable. Many employees don't realize this option exists. For mobile data costs, employees who regularly work remotely should request a company data plan supplement from HR.

---

### Module 3: Secure Communication and Data Handling

---

**Slide 6: Approved Tools and Shadow IT**

Content:
- **Shadow IT** is any software, app, or service an employee uses for work that has not been approved by IT
- Common shadow IT examples in BPO environments: WhatsApp or Telegram for work communications, Dropbox or Google Drive for file sharing, personal Gmail for work emails, consumer-grade Zoom instead of approved Teams
- Shadow IT creates **unmonitored data channels** outside the company's DLP (Data Loss Prevention) controls — sensitive data shared on unapproved platforms is not protected by corporate security tools
- **Approved communication tools at CyberShield:** Microsoft Teams, Outlook, SharePoint, OneDrive
- If a client requests that you communicate via an unapproved channel: escalate to your manager and IT before agreeing
- **Installing software requires IT approval** — do not self-install any applications on company devices

Speaker Notes: Shadow IT is rampant in BPO environments, often driven by client preferences. The key message: even if the client asks you to use WhatsApp, you must escalate rather than comply. Your manager and IT can negotiate an approved alternative with the client.

---

## Course: Physical Security Awareness

**Duration:** 20 minutes | **Difficulty:** Beginner | **Passing Score:** 75%

---

### Module 1: Tailgating and Access Control

---

**Slide 1: Why Physical Security Matters in Cybersecurity**

Content:
- **Physical and digital security are inseparable** — the most sophisticated digital security can be bypassed if an attacker gains physical access to your workspace
- Common physical security breaches in BPO environments:
  - **Tailgating:** Following an authorized employee through a secure door without badging in
  - **Laptop theft:** An unlocked or unattended laptop can be stolen, providing direct access to all its data
  - **USB drops:** Attackers leave USB drives in parking lots or reception areas hoping curious employees will plug them in
  - **Shoulder surfing:** An unauthorized person reading your screen in the office or a public location
  - **Social engineering entry:** Impersonating a vendor, maintenance worker, or new hire to gain building access

Speaker Notes: Physical security feels less "techy" to many employees, which means it often gets less attention. Use the statistic that 25% of data breaches involve a physical element to reset expectations. In a BPO environment, a visitor who photographs an agent's screen has potentially compromised client data.

---

**Slide 2: Tailgating — The Most Common Physical Attack**

Content:
- **Tailgating (piggybacking)** occurs when an unauthorized person follows an authorized person through a secured entry point
- Attackers rely on social norms — it is awkward to challenge someone who looks like they belong
- **Your responsibility:** Do not hold the door open for anyone you cannot positively identify as an authorized employee. Each person must badge in independently
- **What to say** to someone attempting to tailgate: "Hi, could you badge in? Our policy requires everyone to scan individually." Most people will understand — legitimate visitors will not object
- If a person attempts to force entry or becomes aggressive when challenged, **do not physically confront them** — call security immediately
- Report all tailgating incidents to your line manager and the security desk within 30 minutes

Speaker Notes: The social awkwardness of denying entry to someone is real. Providing a script ("Hi, could you badge in?") removes the guesswork and gives employees the words they need in the moment. Emphasize that this is a safety measure, not an accusation.

---

**Slide 3: Visitor Management**

Content:
- All visitors must **sign in at reception** and receive a visitor badge before entering any work area
- **Never** escort a visitor to a sensitive area (server room, command center, compliance floor) without prior written authorization from a department head
- Visitor badges are designed to be **visually distinct** from employee badges — if you see someone without an employee badge in a restricted area, ask them to wait while you notify the front desk
- Do not discuss client information, system details, or security procedures in the presence of visitors
- **Vendor and maintenance visits** must be pre-scheduled and verified against the authorized vendor list — anyone claiming to be "IT support" or "building maintenance" without prior notice should be held at reception until verified
- Ensure visitors are never left unattended in any area where screens, documents, or system access is visible

Speaker Notes: Visitors who appear legitimate (wearing a uniform, carrying equipment, acting confident) are often exactly who attackers try to impersonate. The key habit: zero access without verification, regardless of how convincing the story seems.

---

### Module 2: Clean Desk and Screen Security

---

**Slide 4: The Clean Desk Policy**

Content:
- A **clean desk policy** requires that sensitive documents, devices, and credentials are secured when not actively in use
- What must be secured when you step away from your desk:
  - All printed documents containing client data, PII, account numbers, or passwords
  - Notebooks, sticky notes, or whiteboards containing system credentials or client information
  - USB drives, smartcards, and access tokens
  - Company devices that are not in active use
- At end of shift: **all sensitive documents must be locked in your drawer or shredded** — never left on the desk overnight
- CyberShield conducts **random clean desk audits** — violations are documented and result in a security awareness reminder from your manager on the first occurrence

Speaker Notes: Sticky note passwords are the single most common clean desk violation in BPO environments. Don't just mention it — make it vivid: "A visitor who photographs a sticky note on your monitor has potentially stolen credentials." The clean desk audit point motivates compliance through accountability.

---

**Slide 5: Screen Lock — The Simplest Security Habit**

Content:
- Locking your screen when stepping away prevents anyone from accessing your session, your email, and all open client data without your knowledge
- **Keyboard shortcuts:**
  - Windows: `Windows + L`
  - macOS: `Control + Command + Q`
  - Linux: `Super + L` (varies by desktop environment)
- CyberShield enforces **automatic screen lock after 5 minutes** of inactivity on all managed devices — this is a policy floor, not a substitute for manual locking
- Stepping away to a meeting, the bathroom, or even a 30-second water break is long enough for someone to photograph your screen or access your system
- Enable **"Require password immediately after sleep/screen saver"** in your device settings — this prevents the lock from being bypassed by waking the device

> **Scenario Box:** Paul leaves his desk to attend an urgent manager call without locking his screen. His CRM is open showing a client's account details. A maintenance worker who was working nearby photographs the screen with a phone before anyone notices. This is a data breach event — a reportable incident under GDPR and client contracts. The 2-second screen lock shortcut would have prevented it entirely.

Speaker Notes: The 2-second time investment vs. a reportable data breach is a compelling contrast. Practice the shortcut with the group — have everyone press Windows+L simultaneously. Building the muscle memory during the training is more effective than just describing it.

---

**Slide 6: USB Security and Removable Media**

Content:
- USB drives are one of the most reliable malware delivery methods — they bypass email filters entirely
- **The USB drop attack:** Attackers leave infected USB drives in car parks, reception areas, and restrooms, labeled with enticing names like "Q3 Bonuses" or "Confidential HR"
- **Studies show over 50% of people plug in found USB drives** — curiosity and altruism ("maybe someone lost it") override security instincts
- CyberShield policy: **Never plug an unknown USB drive into a company device.** Hand it to IT Security for forensic analysis
- Company-issued USB drives are encrypted using BitLocker To Go — only encrypted, IT-issued media may be used on company devices
- **Disable AutoPlay:** Intune enforces this on all company devices — if you plug in a USB drive and it immediately starts running a program, disconnect immediately and report to IT

Speaker Notes: The USB drop experiment context (multiple studies show 45-70% insertion rates) challenges the assumption that employees would simply know not to plug in random USB drives. The solution must also be practical: "Give it to IT" is achievable; "Just never pick it up" ignores human altruism.

---

**Slide 7: Module Summary — Physical Security is Everyone's Job**

Content:
- Physical and digital security are equally important — a physical breach can bypass all your digital defenses
- **Key habits to build:**
  - Always badge in individually — never hold doors or accept tailgating
  - Challenge unescorted visitors professionally and involve security
  - Lock your screen every time you step away — `Windows + L`
  - Clean desk at all times: secure documents, devices, and credentials when not in use
  - Never plug in unknown USB drives — hand them to IT
- Physical security is enforced through audits, visitor logs, and CCTV monitoring — but it only works when **every employee participates**
- Your security score on CyberShield LMS increases when you complete the Physical Security quiz with 75% or higher

Speaker Notes: Close with a clear call to action. The quiz is next — ensure learners understand the material is drawn from all modules in this course. The security score mention connects training completion to the gamification system visible on their dashboard.
