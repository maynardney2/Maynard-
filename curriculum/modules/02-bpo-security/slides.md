# BPO Security Track — Slide Decks

> **Track:** BPO Security | **Audience:** All BPO Employees | **Required:** Yes (most courses)

---

## Course: PII Handling & Data Privacy

**Duration:** 40 minutes | **Difficulty:** Intermediate | **Passing Score:** 85%

---

### Module 1: Understanding Personally Identifiable Information

---

**Slide 1: What Is PII and Why Does It Matter?**

Content:
- **Personally Identifiable Information (PII)** is any data that can be used, alone or in combination, to identify a specific individual
- As a BPO employee, you handle other people's PII on behalf of your clients — this creates legal, ethical, and contractual obligations
- **Direct identifiers** (identify a person alone): full name, national ID/SSN/passport number, date of birth, email address, phone number, biometric data, bank account number
- **Indirect identifiers** (identify a person in combination): job title, zip code, employer, age range, vehicle details, IP address, device identifiers
- **Special category data** (highest protection level): health records, racial/ethnic origin, religious beliefs, sexual orientation, trade union membership, criminal history
- A data breach involving PII can result in financial penalties up to **4% of global annual turnover** under GDPR, reputational damage, and loss of client contracts

Speaker Notes: Many employees don't realize that seemingly innocuous pieces of information become PII when combined. Use the "mosaic effect" illustration: job title + company + city + age might uniquely identify someone even without their name. The financial penalty context helps convey why clients take this so seriously.

---

**Slide 2: Categories of PII You Handle at CyberShield BPO**

Content:
- **Customer PII** (collected from client end-customers): names, contact details, account numbers, transaction history, support case details
- **Employee PII** (your colleagues' and your own): payroll information, performance reviews, health information for benefits, emergency contacts
- **Financial PII:** Credit card numbers, bank account details, transaction amounts, credit scores — these carry PCI-DSS obligations in addition to general privacy requirements
- **Health and Benefits PII:** Medical claims data, insurance coverage information, health condition disclosures
- **Authentication data:** Passwords, security questions, PINs, biometrics — these enable identity theft if compromised and must never be logged or transmitted in cleartext
- **Know your data classification:** Before handling any data, check whether it is labeled Public, Internal, Confidential, or Restricted in CyberShield's data classification policy

Speaker Notes: Grounding the abstract concept in what employees actually touch daily makes it tangible. Encourage learners to think about their specific role: what data does my screen show every day? The classification label system is the operational tool they use to apply these principles.

---

**Slide 3: GDPR Basics — The European Standard**

Content:
- **GDPR (General Data Protection Regulation)** is the EU's comprehensive data privacy law, effective May 2018. It applies when processing personal data of EU residents, regardless of where your company is located
- **Six lawful bases for processing PII under GDPR:**
  1. Consent — the individual has given clear, informed consent
  2. Contract — processing is necessary to fulfill a contract with the individual
  3. Legal obligation — required by law
  4. Vital interests — necessary to protect someone's life
  5. Public task — processing is in the public interest
  6. Legitimate interests — a balancing test weighing organizational need against individual rights
- In a BPO context, the most common basis is **contract** (serving the client's customers) and **legal obligation**
- **GDPR individual rights** you must support: right to access, right to rectification, right to erasure ("right to be forgotten"), right to data portability

Speaker Notes: BPO employees don't need to be GDPR lawyers, but they need to recognize when an end-customer is exercising a GDPR right. If a customer says "I want you to delete all my data," this is a Subject Access Request or erasure request that must be escalated — it cannot be ignored or handled informally.

---

**Slide 4: PDPA — The Philippine Data Privacy Framework**

Content:
- **Republic Act 10173 — Data Privacy Act of 2012 (DPA)**, enforced by the **National Privacy Commission (NPC)**, is the Philippine equivalent of GDPR
- The DPA requires all organizations processing Philippine residents' personal data to register with the NPC and appoint a **Data Protection Officer (DPO)**
- CyberShield BPO is registered with the NPC — our DPO is `dpo@cybershield.local`
- **Key DPA obligations for employees:**
  - Process personal information only within the scope of your job function
  - Do not share PII with unauthorized parties, including other departments that don't need it
  - Report privacy incidents (unauthorized access, accidental disclosure) to the DPO within 72 hours
  - Participate in mandatory annual privacy training (this course fulfills that requirement for your role)
- Penalties under RA 10173 include fines of up to PHP 5 million and imprisonment of up to 6 years

Speaker Notes: The DPA/NPC framework is directly relevant to Philippine-based BPO workers. The 72-hour reporting window (mirroring GDPR's 72-hour breach notification rule) should be emphasized — employees sometimes delay reporting out of fear of consequences. The consequence of non-reporting is far worse than the incident itself.

---

### Module 2: Data Minimization and Purpose Limitation

---

**Slide 5: Collect Only What You Need**

Content:
- **Data minimization** is the privacy principle that organizations should only collect and process the minimum amount of PII necessary for a specific, legitimate purpose
- **Why it matters for BPO employees:**
  - Reduces the scope of a potential breach — you cannot lose data you never collected
  - Fulfills contractual obligations to clients who have DPA/GDPR compliance requirements
  - Reduces legal liability
- **Practical application:** Before accessing a customer record, ask: "Do I need this customer's full file, or just the account number?"
- **Do not access PII** for accounts you are not directly working on, even if the system technically allows it — "curiosity browsing" of client records is a policy violation with disciplinary consequences
- Do not copy PII into personal notes, local files, or unofficial systems unless explicitly authorized

Speaker Notes: The "curiosity browsing" point is important — in BPO environments, agents sometimes look up coworkers' accounts, ex-partners' information, or celebrities' records "just to see." This is an unauthorized access event even if the person has system access. Include this scenario explicitly if the audience is a customer service team.

---

**Slide 6: Purpose Limitation — Don't Repurpose Data**

Content:
- **Purpose limitation** means that PII collected for one purpose should not be used for a different purpose without the individual's explicit consent
- Examples of purpose limitation violations in BPO contexts:
  - Using a customer's email address collected for support ticket follow-up to send them marketing material
  - Sharing customer contact details with a third-party vendor not named in the privacy notice
  - Using access logs (collected for security) to track employee productivity without disclosure
  - Retaining customer data beyond the agreed retention period "just in case it's useful later"
- If you identify a data use that seems outside the original collection purpose, escalate to your DPO before proceeding
- Processing data for a **compatible purpose** (closely related to original purpose) may be permissible — but requires DPO sign-off

Speaker Notes: Purpose limitation violations are one of the most common (and least recognized) compliance failures. Use a concrete example: "You collected a customer's phone number to confirm their order. Using it to call them for a satisfaction survey requires separate consent — it is a different purpose."

---

**Slide 7: Secure Data Disposal**

Content:
- Data that is no longer needed must be securely disposed of — simply deleting a file is not sufficient
- **Digital data disposal:**
  - Files in the Recycle Bin are not deleted — empty the bin AND use the approved data sanitization tool for sensitive files
  - Shared drives: coordinate with IT before deleting shared documents that may have compliance holds
  - Email: use Microsoft Purview to apply retention labels; do not manually delete compliance-relevant emails
  - System decommissioning: IT will perform certified disk wiping — never donate, sell, or dispose of company hardware independently
- **Physical document disposal:**
  - Cross-cut shred all documents containing PII, financial data, or client information — do not use strip shredders (strips can be reassembled)
  - Use the shred bins provided in the office — these are collected by a certified destruction vendor
  - If you work remotely: CyberShield provides prepaid shred bags — request from the office administrator

Speaker Notes: The misconception that deleting = erasing is extremely common. A brief explanation of why — files are simply marked as available space but remain recoverable until overwritten — helps employees understand the requirement. The remote work shred bag program is a practical enabler for compliance.

---

### Module 3: Privacy Incidents and Breach Response

---

**Slide 8: What Constitutes a Privacy Incident?**

Content:
- A **privacy incident** is any event involving unauthorized access, disclosure, loss, or alteration of personal information
- **Examples of reportable privacy incidents:**
  - Sending an email with customer PII to the wrong recipient
  - Leaving a printed customer report on a printer or in a public area
  - Accessing customer records outside your authorized scope
  - Discovering that a shared folder containing PII was set to "Anyone with the link" for an unknown period
  - Losing a USB drive, laptop, or printed document containing PII
  - A third party gaining access to PII without authorization (including a colleague who doesn't need it)
- Privacy incidents **do not need to be malicious** to be reportable — accidental incidents carry the same reporting obligations

Speaker Notes: The accidental incident point is crucial. Employees often don't report because "I didn't mean to do it" or "it was just a mistake." The legal obligation to report applies regardless of intent. Non-reporting is almost always a worse outcome than timely reporting.

---

**Slide 9: How to Report a Privacy Incident**

Content:
- **Report immediately** — do not wait to see if it "becomes a problem." Under GDPR and DPA, organizations have 72 hours to notify regulators after becoming aware of a breach
- **How to report at CyberShield:**
  1. Call the Privacy Incident Hotline: **ext. 5100** (available 24/7)
  2. Email: `privacy-incident@cybershield.local` (include "INCIDENT" in the subject line)
  3. Complete the Privacy Incident Report form on the intranet portal
- **What to include in your report:**
  - What happened (what data was involved)
  - When it happened (or when you discovered it)
  - How many individuals may be affected
  - What you have done so far (if anything)
- You will be **protected from retaliation** for good-faith reporting. The company's liability is significantly reduced when incidents are reported promptly.

Speaker Notes: Provide the phone number and email on screen and suggest employees save the number to their phone contacts now. The psychological safety message — no retaliation for good-faith reporting — is worth repeating twice. Fear of consequences is the #1 reason incidents go unreported.

---

## Course: PCI-DSS Awareness for Agents

**Duration:** 35 minutes | **Difficulty:** Intermediate | **Passing Score:** 85%

---

### Module 1: Introduction to PCI-DSS

---

**Slide 1: What is PCI-DSS and Why Does It Apply to You?**

Content:
- **PCI-DSS (Payment Card Industry Data Security Standard)** is a security framework created by Visa, Mastercard, American Express, Discover, and JCB to protect cardholder data
- CyberShield BPO processes or handles payment card data on behalf of clients — this subjects the entire organization and every relevant employee to PCI-DSS requirements
- **PCI-DSS applies to you if you:** Take payment card numbers over the phone, view card data in a CRM, process refunds, handle cardholder documents, or have access to systems that store, process, or transmit card data
- **Why it matters:** A single PCI-DSS violation can result in fines of $5,000–$100,000 per month, loss of the ability to process card payments, and breach liability that is passed to CyberShield BPO and its individual employees
- There are 12 PCI-DSS v4.0 requirements organized around 6 goals — this course focuses on the requirements that directly affect your daily role

Speaker Notes: Many agents think PCI-DSS is an "IT thing." Emphasize that it is specifically designed with people who handle card data in mind — not just technology. The liability point resonates: if you write down a card number in violation of policy and a breach results, personal liability is possible in some jurisdictions.

---

**Slide 2: Cardholder Data — What You Can and Cannot Store**

Content:
- **Cardholder Data (CHD)** includes: Primary Account Number (PAN — the 16-digit card number), cardholder name, expiration date, and service code
- **Sensitive Authentication Data (SAD)** includes: Full magnetic stripe data, CVV/CVC/CID (the 3-4 digit security code), PINs and PIN blocks
- **The cardinal rule:** Under PCI-DSS, **Sensitive Authentication Data must NEVER be stored** after authorization — not in databases, not in notes, not in emails, not verbally dictated and written down
- **PAN storage is permitted** only when it is masked (showing only the last 4 digits) or encrypted using approved methods
- **What this means for your role:**
  - Never write down a card number — not even to read it back to a customer
  - Never type a card number into a non-PCI-compliant system or a chat window
  - If a customer reads you their CVV, you must not record it anywhere — use it only for the transaction in the approved system

Speaker Notes: The CVV rule consistently surprises agents who believe documenting it for verification purposes is acceptable. Make the rule unambiguous: "CVV touches your ears and goes into the system. It cannot be written anywhere at any stage." This is why call recording systems used in PCI-scope areas must be paused during card number entry.

---

**Slide 3: The 12 PCI-DSS Requirements — Your Role**

Content:
- PCI-DSS v4.0 has 12 requirements. As an agent, you directly interact with several:
- **Req 3: Protect stored cardholder data** — Never store SAD; if you must retain PAN, only in approved systems with masking
- **Req 7: Restrict access by business need** — Only access the card data you need to complete your specific task
- **Req 8: Identify users and authenticate access** — Use your individual login credentials only — never share them. Each transaction must be attributable to a specific person
- **Req 9: Restrict physical access** — Never leave card data visible on screen or in documents; clear desk policy applies
- **Req 11: Test security systems** — Cooperate with security assessments and phishing simulations — they test the controls that protect card data
- **Req 12: Information security policy** — You have read and agreed to the Information Security Policy at onboarding — this training reinforces those obligations

Speaker Notes: Requirement 8 (no credential sharing) is the most frequently violated by agents who share logins with teammates who are locked out or late arriving. Frame it this way: shared credentials mean that if fraud occurs, no one can be individually held accountable — which is why PCI requires individual accountability.

---

### Module 2: Safe Handling of Cardholder Data

---

**Slide 4: Taking Card Payments Over the Phone — Do's and Don'ts**

Content:
- **DO:** Use only the company-approved payment processing system for all card transactions
- **DO:** Ensure you are in a private area where others cannot hear the card number — in an open floor, step away or lower your voice
- **DO:** Pause call recording systems **before** the customer reads card details (CyberShield's system auto-pauses — verify the pause icon is active)
- **DO:** Confirm PCI scope: if a customer offers to read their CVV, advise them to enter it via the IVR system if available — do not accept it verbally unless the system requires it
- **DON'T:** Write card numbers on paper, whiteboards, sticky notes, or any physical medium
- **DON'T:** Type card numbers into Teams, email, CRM notes, or any non-PCI-compliant application
- **DON'T:** Repeat the full card number back to the customer — only confirm the last 4 digits

> **Scenario Box:** A customer insists on reading their card number slowly so the agent can "double-check it." The agent enters the number into the approved system but reflexively jots the last 8 digits on a sticky note to "make sure I got it right." This sticky note is a PCI-DSS violation the moment it is created. The agent should not have written anything down — the payment system confirms successful entry.

Speaker Notes: The sticky note scenario happens regularly. The habit of "writing it down to confirm" feels helpful but creates a serious compliance failure. The solution: trust the system's confirmation, not your handwritten note.

---

**Slide 5: Screen Security for Card Data**

Content:
- When cardholder data is visible on your screen, you are in a **PCI-scope moment** and physical security controls apply immediately
- Never allow others to see cardholder data on your screen — position monitors to face away from walkways, visitor areas, and shared spaces
- **Masking in systems:** Approved CRM and payment systems display PAN as `**** **** **** 1234` — if your system shows the full number, report it to IT immediately as a potential misconfiguration
- Never take screenshots, photographs, or screen recordings of pages containing cardholder data
- Screen capture is blocked by Intune policy on company devices — attempts to bypass these controls are a serious compliance violation
- **End-of-transaction checklist:** Close the payment window immediately after the transaction; do not leave card data on screen while you take other calls

Speaker Notes: The screenshot prohibition sometimes frustrates agents who use screenshots for training or quality purposes. Explain the alternative: Intune-managed screen capture tools that automatically redact PCI-scope fields are available from IT for approved quality monitoring use cases.

---

**Slide 6: Recognizing and Reporting PCI Violations**

Content:
- You are responsible for reporting suspected PCI-DSS violations — yours or others' — regardless of who is involved
- **Report to:** Line manager AND `pci-compliance@cybershield.local`
- **Reportable events include:**
  - Finding a written card number anywhere — sticky note, notebook, email, spreadsheet
  - Seeing a colleague read back a full card number or enter it into an unauthorized application
  - Any system displaying full, unmasked PANs when it should be showing masked data
  - Receiving an email or message containing card data — forward to IT without viewing the card details yourself, then delete
  - Unauthorized access to payment processing systems

Speaker Notes: The "receiving card data in email" scenario is common — clients or customers sometimes email card numbers. The correct response is to immediately forward to IT and delete, and to notify the sender that card numbers must never be sent via email. Do not process a transaction from data received via email.

---

## Course: Screen Privacy & Data Exposure Prevention

**Duration:** 20 minutes | **Difficulty:** Beginner | **Passing Score:** 75%

---

### Module 1: Visual Data Exposure Risks

---

**Slide 1: What Is Visual Hacking?**

Content:
- **Visual hacking** is the act of capturing sensitive information by viewing an unprotected screen — with eyes, a camera, or a recording device
- The Ponemon Institute found that **visual hacking succeeds in 91% of attempts** in open office environments when tested by ethical hackers
- In a BPO environment, sensitive data is on screen for hours every day — customer names, account numbers, PII, client records
- Threat sources include: coworkers from other departments, visitors, maintenance staff, delivery personnel, and external attackers with cameras
- Visual data exposure does not require technical skill — a phone camera pointed at your screen from across the room is sufficient
- Data captured visually is still a **data breach** with the same legal and contractual consequences as a technical breach

Speaker Notes: The 91% success rate statistic is striking. If possible, demonstrate by having a volunteer attempt to read information from a screen at typical office distances. The visceral experience of "that was easier than I thought" is more memorable than any statistic.

---

**Slide 2: Physical Privacy Screens**

Content:
- A **privacy screen filter** is a thin optical film applied to a monitor that narrows the viewing angle to approximately 30 degrees — only someone directly in front can see the screen clearly
- Privacy screens are **mandatory** for all workstations in open-plan BPO floors and available from your line manager or the supply room
- Privacy screens do not affect screen clarity for the legitimate user when viewed straight-on
- **Home workers:** Privacy screens are also available for home office setups — request via IT if your workspace is shared with family members or roommates
- Regularly clean privacy screen filters — fingerprints and dust can reduce effectiveness
- If your privacy screen is damaged or missing, request a replacement immediately — working without one on a PII-handling workstation is a policy violation

Speaker Notes: Some employees resist privacy screens because they slightly reduce maximum screen brightness. Address this: brightness can be adjusted upward; the alternative (visual data exposure) cannot be easily remediated after the fact. Most users adapt within a day.

---

**Slide 3: Workstation Positioning and Environmental Design**

Content:
- **Optimal screen positioning:** Your monitor should face a wall or solid partition, not a corridor, window, or shared space
- When designing your home workspace: position the screen so that anyone entering the room sees your back, not the screen
- **Windows and reflections:** Screens visible through office windows can be photographed from outside the building — apply window films or close blinds in perimeter offices
- **Desk camera awareness:** Laptop cameras should face you during calls and be covered with the built-in shutter (or a webcam cover) when not in use
- In open offices: raise the question with your manager if your current desk placement creates unavoidable viewing angles — workstation reallocation may be appropriate
- **Printing at the printer:** Never leave printed documents unattended at the printer — stand by the machine and collect printouts immediately

Speaker Notes: The window/building perimeter reflection issue is often overlooked in office design reviews. Encourage managers in the room to look at their floor layout with fresh eyes. The printer tip is simple but addresses a very common compliance gap.

---

### Module 2: Auto-Lock, Screen Capture, and Policy

---

**Slide 4: Auto-Lock Policy and Screen Lock Habits**

Content:
- CyberShield enforces **5-minute auto-lock** on all managed devices — this is the maximum allowed idle time before the screen locks automatically
- **Manual lock is always required** when stepping away, regardless of how brief the absence — use `Windows + L` before standing up
- Auto-lock is a safety net, not a substitute for active locking: **5 minutes is long enough** for an unauthorized person to read, photograph, or export sensitive data
- Password must be required to unlock — verify in Settings > Accounts > Sign-in Options that "Require sign-in: Immediately" is set (Intune enforces this, but verify it is working)
- **For IT staff with remote sessions open:** Remote desktop sessions must also be locked at the remote end when you step away — closing the local window does not lock the remote system

Speaker Notes: The IT staff remote session point is a subtle but important gap. A helpdesk agent who locks their local laptop but leaves a remote session with admin access open has essentially left the most privileged access unprotected.

---

**Slide 5: Screen Capture and Recording Controls**

Content:
- Screen capture, screenshot, and screen recording are **disabled by Intune policy** on all CyberShield managed devices for applications classified as containing client or PII data
- This protection exists for CRM systems, payment processing tools, HR platforms, and financial systems
- **Permitted screen capture:** General desktop, approved training platforms, non-sensitive productivity tools — subject to normal data handling rules
- Never use a second device (personal phone, tablet) to photograph your work screen — this bypasses all technical controls and constitutes unauthorized data exfiltration
- Using personal phones to photograph work screens is a terminable policy violation and potentially a criminal offense under RA 10173 (DPA)
- If you need to capture a system error or training example, contact IT for an approved method

> **Scenario Box:** During a call, an agent encounters an unusual error message in the payment system. To report it to IT, she uses her personal phone to take a photo of the screen, which also captures several customer records visible in the background. This is an unauthorized disclosure of PII — a reportable incident — even though the intent was benign. The correct approach: use the system's built-in error reporting tool or describe the error by phone/Teams to IT.

Speaker Notes: This scenario is almost a daily occurrence in some BPO environments. The solution — describe the error rather than photograph it — might seem inconvenient. IT teams can often diagnose errors from descriptions alone, and for complex issues, IT can access the same screen remotely under controlled conditions.

---

## Course: Client Data Compliance & NDA Obligations

**Duration:** 30 minutes | **Difficulty:** Intermediate | **Passing Score:** 85%

---

### Module 1: Understanding Your Contractual Obligations

---

**Slide 1: The NDA — Your Legal Commitment**

Content:
- **Non-Disclosure Agreement (NDA)** is a legally binding contract that prevents you from disclosing confidential information to unauthorized parties
- At CyberShield, your employment contract includes NDA provisions that cover all client information, business methods, system access, and internal processes
- **NDA obligations continue after employment ends** — for a period specified in your contract (typically 1-3 years for standard confidentiality; some provisions are perpetual)
- **What is covered by your NDA:**
  - Client identities and contract terms
  - Customer PII processed on behalf of clients
  - Client business processes, scripts, and workflows
  - System credentials and access methods
  - Pricing, financials, and commercial terms
- Breaching an NDA can result in civil litigation, damages claims, and in severe cases criminal prosecution under cybercrime and data protection laws

Speaker Notes: Employees often sign NDAs at onboarding without truly understanding what they cover. This slide should feel like a genuine review of their existing legal obligation, not just an abstract rule. Encourage learners to re-read their employment contract NDA clause if they have questions.

---

**Slide 2: Client-Specific Data Handling Requirements**

Content:
- Each client account may have **unique data handling requirements** specified in the Master Service Agreement (MSA) and Data Processing Agreement (DPA)
- Common client-specific requirements you may encounter:
  - **Data residency:** Client data must remain in Philippines/specific geography — you cannot upload it to a cloud service outside the approved region
  - **Access restriction:** Only named individuals or teams are authorized to access certain data sets
  - **Retention and deletion:** Client data must be deleted within X days of contract termination — with certification
  - **Prohibited sub-processing:** Client's data cannot be shared with third-party tools (AI assistants, analytics platforms) without explicit client approval
  - **Audit rights:** Clients have the right to audit CyberShield's data handling practices — you may be interviewed or asked to demonstrate compliance

Speaker Notes: The "no AI tools with client data" point is increasingly critical as employees use AI assistants. If your client's MSA prohibits sub-processing, uploading client data to an AI assistant (ChatGPT, Copilot without a DPA, etc.) is a contract breach. This connects directly to the AI track course on Safe AI Tool Usage.

---

**Slide 3: Data Classification in Practice**

Content:
- CyberShield uses **Microsoft Purview Information Protection** labels to classify data:
  - **Public:** No restrictions on sharing — press releases, published marketing material
  - **Internal:** For employees only — internal processes, meeting notes, non-sensitive business data
  - **Confidential:** Restricted access, encrypted at rest and in transit — most client data, financial reports, HR information
  - **Restricted:** Highest protection — PCI-scope data, personal health information, strategic commercial plans
- **Your responsibility:** Apply the correct label when creating documents. When in doubt, label one level higher — over-classifying is safer than under-classifying
- Purview DLP policies automatically prevent Confidential and Restricted data from being shared externally via Teams, email, or OneDrive without authorization prompts
- Do not change a document's label to a lower classification to make sharing easier — this is a deliberate policy bypass and a disciplinary matter

Speaker Notes: The "label down to share" behavior is common when employees are blocked from doing something they believe is legitimate. The correct response is to request an exception through the data access request process, not to change the label. Emphasize that DLP alerts are reviewed by the security team.

---

### Module 2: Breach Notification and Incident Response

---

**Slide 4: What Triggers a Breach Notification?**

Content:
- A **data breach** is any security incident resulting in accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to, personal data
- Under GDPR: organizations must notify the relevant supervisory authority **within 72 hours** of becoming aware of a breach likely to result in risk to individuals' rights and freedoms
- Under the Philippine DPA: the NPC must be notified **within 72 hours** of discovery; affected individuals must be notified as soon as practicable
- **Contractual notification:** Most client MSAs require breach notification **within 24-48 hours** — earlier than the regulatory deadline
- **Triggering events that require notification:**
  - Loss of a device containing unencrypted client data
  - Unauthorized access to client records confirmed
  - Sending client data to an unauthorized recipient
  - Ransomware or malware affecting systems with client data

Speaker Notes: The 72-hour clock starts when the organization "becomes aware" — not when the breach actually occurred. This means the moment you report a potential incident, the clock starts. Prompt reporting to internal teams (so the DPO and legal team can assess) is critical to meeting notification deadlines.

---

**Slide 5: Your Role in the Incident Response Process**

Content:
- When you discover or suspect a data breach, your role is to **report and preserve** — not to investigate or fix it yourself
- **Report immediately:**
  - Line manager (verbally, first)
  - Privacy Incident Hotline: ext. 5100
  - `privacy-incident@cybershield.local`
- **Preserve evidence:** Do not delete emails, files, or system logs. Do not attempt to "clean up" a mistake by deleting files — this could constitute obstruction
- **Cooperate with the investigation:** The DPO or IT Security team will lead the incident response. Answer questions truthfully and completely — your cooperation is your best protection
- **Communicate only through approved channels:** Do not discuss breach details on personal devices, social media, or with unauthorized parties (including family) during an active investigation
- **Client notification is handled by management** — never contact a client directly about a breach unless instructed

Speaker Notes: The "do not contact the client directly" instruction is important — well-meaning employees sometimes try to self-manage the relationship. This can inadvertently create liability issues or contradict what legal and management are advising. Centralized communication is a legal protection.

---

**Slide 6: Compliance Culture — Why It Matters Beyond Rules**

Content:
- Compliance is not just about avoiding penalties — it is about maintaining the trust that BPO relationships are built on
- Clients entrust CyberShield with their customers' data because they believe we will protect it as rigorously as they would themselves
- **The cost of non-compliance:**
  - Contract termination: losing a client account worth millions of pesos
  - Regulatory fines and legal costs
  - Reputational damage that affects every employee's job security
  - Individual accountability: employees can be personally named in regulatory findings
- **The benefit of a compliance culture:**
  - Client retention and contract renewal confidence
  - Competitive advantage when bidding for security-sensitive accounts
  - Your security score and professional development in a field where privacy skills are increasingly valued
- Every data handling decision you make — however small — is a vote for or against a culture of trust

Speaker Notes: End this module on a positive, purpose-driven note rather than a fear-based one. Employees who understand the "why" behind compliance rules are more likely to apply good judgment in ambiguous situations that aren't covered by explicit policies. The security score connection makes the abstract concrete.
