export interface PhishingScenario {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'qr' | 'voice';
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'credential_harvest' | 'malware' | 'social_engineering' | 'urgency';
  industry: 'bpo' | 'general' | 'microsoft' | 'banking';
  subject?: string;
  senderName?: string;
  senderEmail?: string;
  previewText?: string;
  body?: string;
  smsBody?: string;
  voiceScript?: string;
  redFlags: string[];
  educationalContent: string;
  clickRate?: number; // historical benchmark %
}

export const phishingScenarios: PhishingScenario[] = [
  {
    id: 'ps-001',
    name: 'Microsoft 365 Password Expiry',
    type: 'email',
    difficulty: 'easy',
    category: 'credential_harvest',
    industry: 'microsoft',
    subject: 'ACTION REQUIRED: Your Microsoft 365 password expires in 24 hours',
    senderName: 'Microsoft Account Team',
    senderEmail: 'security-noreply@microsoft-accounts.support',
    previewText: 'Your password for jane.smith@company.com expires soon. Click here to reset immediately.',
    body: `Dear jane.smith@company.com,

Your Microsoft 365 password is set to expire in 24 hours.

To avoid losing access to your email, Teams, and SharePoint files, please reset your password immediately.

[RESET MY PASSWORD NOW]

If you do not reset your password within 24 hours, your account will be locked and you will need to contact IT Support to regain access.

This may affect your ability to:
• Access your email
• Join Teams meetings
• Open shared files on SharePoint
• Use any Microsoft 365 apps

Microsoft Account Security
Microsoft Corporation | One Microsoft Way, Redmond, WA 98052`,
    redFlags: [
      'Sender domain is "microsoft-accounts.support" — not an official microsoft.com domain',
      'Creates artificial urgency with "24 hour" deadline',
      'Hover over the link to see it goes to a non-Microsoft domain',
      'Generic greeting uses email address instead of your name',
      'Microsoft never sends password reset requests via email proactively',
      'The link button goes to http://reset-m365-password.click/login — not microsoft.com',
    ],
    educationalContent: `Great job if you spotted this! Here is what to do when you see emails like this:

**What legitimate Microsoft emails look like:**
• Sent from @microsoft.com or @accountprotection.microsoft.com only
• Address you by name, not just your email address
• Never ask you to click a link to reset a password proactively
• Password changes are initiated by YOU at account.microsoft.com

**What to do:**
1. Do NOT click the link
2. If unsure, navigate directly to https://account.microsoft.com in a new browser tab
3. Report this email using the "Report Phishing" button in Outlook
4. Forward to security@company.com

Your IT password policies are managed through your company's Azure AD portal — not through external emails.`,
    clickRate: 28,
  },

  {
    id: 'ps-002',
    name: 'IT Helpdesk Credential Reset Scam',
    type: 'email',
    difficulty: 'medium',
    category: 'credential_harvest',
    industry: 'general',
    subject: 'IT Support: Action needed — Account security verification',
    senderName: 'IT Helpdesk Team',
    senderEmail: 'helpdesk@company-support.net',
    previewText: 'Ticket #IT-48291: We detected unusual activity on your account. Verify your identity.',
    body: `Hi,

This is the IT Helpdesk. We have detected an unusual sign-in attempt on your account from an unrecognized device in Manila, Philippines (IP: 103.52.162.14) at 2:47 AM.

Ticket Reference: #IT-48291

To secure your account, please verify your identity within the next 2 hours:

[VERIFY MY ACCOUNT]

If you do not verify, we will be forced to disable your account as a precautionary measure to protect company data.

If you believe this is a mistake, you can also call our helpdesk at 1-888-555-0192.

Regards,
IT Security Operations
Company IT Support`,
    redFlags: [
      'Sender email is "company-support.net" — not your actual company domain',
      'Creates fear with "unusual sign-in" story and a 2-hour countdown',
      'Real IT teams never ask you to verify credentials via an email link',
      'The phone number listed is not your company\'s real helpdesk number',
      'Ticket numbers are fabricated to appear legitimate',
      'Vague greeting — does not use your name or employee ID',
    ],
    educationalContent: `Your real IT helpdesk will NEVER ask you to click a link to verify your credentials via email.

**How your real IT team reaches you:**
• Through your official company ticketing system (ServiceNow/Jira/etc.)
• Via verified internal Teams messages from known accounts
• By calling your direct extension or verified company phone numbers
• In-person for sensitive account matters

**Identity verification red flags:**
• Any email asking for your password — even from "IT" is a phish
• Urgent account lockout threats are a pressure tactic
• Always verify IT contacts by calling back on the number in the official company directory`,
    clickRate: 45,
  },

  {
    id: 'ps-003',
    name: 'Urgent Client Data Request',
    type: 'email',
    difficulty: 'hard',
    category: 'social_engineering',
    industry: 'bpo',
    subject: 'URGENT: Client XYZ Corp — Data request for audit by EOD',
    senderName: 'Mark Rivera — Account Director',
    senderEmail: 'mark.rivera@xyzcorp-global.com',
    previewText: 'Hi, I need the client data export completed before 5PM today for our external audit team.',
    body: `Hi,

I'm reaching out on behalf of XYZ Corp. We have an urgent compliance audit scheduled for today at 6PM and we need the customer data export that was discussed with your team manager last week.

Please export the following and share via the Dropbox link below:
• Full customer records for Account Group 47-B
• Transaction logs Q3-Q4 2023
• Agent performance data

[UPLOAD TO SECURE DROPBOX]

This is time-sensitive. Our audit team is on-site and waiting. Please do not delay — your manager James has already approved this request verbally.

I'll be on a call for the next 2 hours but you can proceed directly. Please confirm once done.

Best regards,
Mark Rivera | Account Director
XYZ Corp Global | mark.rivera@xyzcorp-global.com`,
    redFlags: [
      'Sender domain "xyzcorp-global.com" may not match the real client\'s official domain',
      'Requests you to act without verifying through your manager directly',
      'Dropbox link is external and unverified — not your company\'s approved transfer method',
      'Mentions verbal approval you cannot confirm — classic social engineering',
      'BPO client data requests always go through official channels, never ad-hoc email',
      'Urgency pressure: "audit team is on-site and waiting"',
    ],
    educationalContent: `Client data requests — especially involving exports — are one of the highest-risk scenarios in BPO operations.

**Your company policy requires:**
1. All client data requests must go through the approved ticketing system
2. No data is shared without documented authorization from both client AND your account manager
3. External uploads must use the company-approved secure transfer tool — NOT personal Dropbox/Google Drive
4. When in doubt: STOP and call your manager directly on their known number

**What to do:**
1. Do NOT click the link or upload any data
2. Contact your direct manager via phone or Teams immediately
3. Report to security@company.com
4. Log the incident in the IT ticketing system`,
    clickRate: 32,
  },

  {
    id: 'ps-004',
    name: 'HR Policy Update with Malicious Link',
    type: 'email',
    difficulty: 'medium',
    category: 'malware',
    industry: 'general',
    subject: 'Important: Updated Employee Benefits & Policy Documents — Action Required',
    senderName: 'HR Department',
    senderEmail: 'hr-updates@company-hr-portal.com',
    previewText: 'New company policies are effective from June 1. Please review and acknowledge by May 31.',
    body: `Dear Team Member,

We have updated several important company policies effective June 1, 2024. All employees are required to review and acknowledge these updates before May 31, 2024.

Updated documents include:
• Employee Benefits Package 2024
• Updated Leave & Attendance Policy
• Remote Work Allowance Guidelines
• Performance Review Process

Please click the link below to log in to the HR portal and acknowledge your receipt:

[REVIEW & ACKNOWLEDGE POLICIES]

Additionally, we have updated the benefits enrollment form. Employees who wish to make changes to their health coverage for the new plan year must log in and complete the form by the same date.

Note: Employees who do not acknowledge by the deadline may have their portal access restricted.

HR Department
Human Resources | People & Culture`,
    redFlags: [
      'Sender domain "company-hr-portal.com" is not your real company domain',
      'The link goes to an external website, not your internal HR system',
      'A deadline with account restriction threat to force quick action',
      'Your real HR system is bookmarked — navigate directly, never via email links',
      '"People & Culture" — check if that is your company\'s actual HR branding',
      'Hover over the link: it goes to a lookalike domain, not your intranet',
    ],
    educationalContent: `HR-themed phishing is very effective because employees trust HR communications.

**How to stay safe:**
• Always access your HR portal by typing the address directly or using your bookmarked link
• Your real HR emails come from @yourcompany.com — not external domains
• Legitimate HR acknowledgment requests will also appear inside your HR portal when you log in normally
• When unsure, call HR directly: the number is in your company directory

**Red flag pattern:** Urgency + Threat of consequence + External link = Phishing`,
    clickRate: 51,
  },

  {
    id: 'ps-005',
    name: 'CEO Gift Card / Wire Transfer (BEC)',
    type: 'email',
    difficulty: 'hard',
    category: 'urgency',
    industry: 'general',
    subject: 'Quick favor needed — confidential',
    senderName: 'CEO John Santos',
    senderEmail: 'john.santos@company-ceo.org',
    previewText: 'Are you available? I need a quick favor handled discreetly.',
    body: `Hi,

Are you available right now? I am in an important board meeting and cannot take calls. I need a quick discreet task handled urgently.

I need you to purchase 4x $250 Amazon gift cards for a client appreciation initiative. This needs to happen in the next 30 minutes before our meeting ends.

Please buy the cards at the nearest store or online, scratch the back, and send me photos of the codes. I will reimburse you through payroll.

Do not mention this to anyone else yet — I want to announce it as a surprise at the all-hands meeting later.

Please confirm you can help.

Best,
John`,
    redFlags: [
      'CEO\'s real email is john.santos@yourcompany.com — not @company-ceo.org',
      'Gift card purchases are never a legitimate business request',
      'The request to keep it secret is a major red flag — legitimate requests are transparent',
      '"Cannot take calls" is designed to prevent you from verifying',
      'Extreme urgency: "30 minutes" pressure tactic',
      'This is a Business Email Compromise (BEC) — no legitimate executive requests gift cards',
    ],
    educationalContent: `Business Email Compromise (BEC) causes billions in losses annually. Gift card scams are a common variant.

**Golden rules:**
1. No legitimate business request will EVER ask you to buy gift cards
2. Always verify unusual requests by calling the executive directly on their known number
3. "Keep it secret" + "urgent" = almost always a scam
4. Verify the sender's actual email domain — criminals register lookalike domains

**If targeted:** Report immediately to IT Security and your direct manager. You will never be blamed for questioning an unusual request through proper verification channels.`,
    clickRate: 15,
  },

  {
    id: 'ps-006',
    name: 'QR Code Phishing Poster',
    type: 'qr',
    difficulty: 'hard',
    category: 'credential_harvest',
    industry: 'general',
    subject: 'Win a Free Lunch — Scan the QR Code!',
    senderName: 'Physical poster in break room / elevator',
    previewText: 'Scan to enter our Employee Appreciation Month prize draw!',
    body: `[Physical poster description]
The poster appears to be from "HR — Employee Appreciation Month."
It features the company logo, a large QR code, and the text:

"🎉 Employee Appreciation Month!
Scan the QR code to enter our lucky draw for:
• Free lunch for 2 weeks
• Amazon vouchers
• Extra leave day

All employees eligible. Scan now — only 50 spots left!"

The QR code, when scanned, leads to a credential harvesting page that mimics the Microsoft 365 login portal.`,
    redFlags: [
      'Posters in physical spaces can be placed by anyone — they are not always from HR',
      'QR codes are opaque — you cannot see the URL before scanning',
      'The page it loads asks for your Microsoft 365 username and password',
      'Real company prize draws are announced through official email and Teams channels',
      'Verify with HR directly before scanning any QR code promising prizes',
      'Check the URL after scanning — does it match your company\'s real domain?',
    ],
    educationalContent: `QR code phishing ("QRishing") is a growing attack vector, especially in physical workplaces.

**Safe QR code habits:**
1. Preview the URL before visiting — most phone cameras show the link before you tap "Open"
2. Never enter login credentials on any page reached via a QR code
3. Verify prize draw communications through your official HR email or Teams
4. Report suspicious posters to Facilities/Security immediately
5. Use a QR scanner app that shows the full URL before loading the page`,
    clickRate: 38,
  },

  {
    id: 'ps-007',
    name: 'SMS Smishing — Account Verification',
    type: 'sms',
    difficulty: 'medium',
    category: 'credential_harvest',
    industry: 'general',
    smsBody: `COMPANY IT ALERT: Your corporate account shows a suspicious login from a new device. Verify your identity now to prevent lockout: https://co-verify.net/account-check?id=EMP4829

Reply STOP to opt out.`,
    redFlags: [
      'Link domain "co-verify.net" is not your company\'s real domain',
      'Legitimate IT teams do not send verification links via SMS to personal phones',
      'The employee ID in the URL ("EMP4829") is fake — designed to look personalized',
      '"Reply STOP to opt out" mimics marketing SMS — IT teams don\'t send opt-out options',
      'Corporate IT communications use official channels (email to work address, Teams)',
    ],
    educationalContent: `SMS phishing (smishing) targets your personal phone using your company identity as bait.

**What to do:**
• Do NOT click SMS links that claim to be from IT
• Your IT team uses your work email and ticketing system — not your personal mobile
• If you\'re locked out of an account, call the IT helpdesk using the number in your company directory
• Report smishing attempts to security@company.com
• Block the number and delete the message`,
    clickRate: 22,
  },

  {
    id: 'ps-008',
    name: 'Vendor Invoice with Malicious Attachment',
    type: 'email',
    difficulty: 'medium',
    category: 'malware',
    industry: 'bpo',
    subject: 'Invoice #INV-2024-0892 — Payment Due in 7 Days',
    senderName: 'Accounts Payable — TechSupplies Ltd',
    senderEmail: 'invoices@techsupp1ies-ltd.com',
    previewText: 'Please find attached Invoice #INV-2024-0892 for services rendered. Due date: May 30, 2024.',
    body: `Dear Accounts Team,

Please find attached Invoice #INV-2024-0892 for IT equipment services rendered in April 2024.

Amount Due: $4,750.00
Due Date: May 30, 2024
Payment Terms: Net 7

Please process payment at your earliest convenience to avoid late fees. The attached Excel file contains the itemized breakdown and banking details.

For questions, contact our billing team at billing@techsupplies.com.

Best regards,
Sarah Chen | Accounts Receivable
TechSupplies Ltd`,
    redFlags: [
      'Sender domain has a typo: "techsupp1ies-ltd.com" (uses number "1" instead of letter "l")',
      'Unexpected invoice — verify with your purchasing team if this vendor is authorized',
      'The Excel attachment may contain malicious macros — never enable macros in unexpected files',
      'Banking details in the attachment is a common payment fraud technique',
      'Your finance team should verify invoices through your procurement system, not email attachments',
    ],
    educationalContent: `Invoice fraud and attachment-based malware are among the most costly attack types.

**Before opening any invoice attachment:**
1. Verify the sender domain is the real company domain (hover over the email address)
2. Check your procurement system — is this vendor approved?
3. If Excel file asks to "Enable Macros" or "Enable Editing" — DON'T. Close the file immediately.
4. Send suspicious invoices to security@company.com before opening

**Macros in Office documents are a primary malware delivery mechanism. When in doubt, don't enable them.**`,
    clickRate: 42,
  },

  {
    id: 'ps-009',
    name: 'AI-Generated Deepfake Voice Message',
    type: 'voice',
    difficulty: 'hard',
    category: 'social_engineering',
    industry: 'bpo',
    voiceScript: `[Voicemail or Teams voice message received]

"Hi [Employee Name], this is James, your account manager. Listen, I'm stuck in back-to-back client calls and I need you to do something urgently. One of our clients just called asking us to process an urgent data update — they said they spoke with you earlier? I need you to go ahead and action it — the login credentials are in the shared drive folder 'Client Updates Q2'. Just update the records and flag it as complete. I'll sign off on it when I'm free. Don't wait for me — the client is upset and time-sensitive. Thanks."

[The voice sounds like your manager James — it was generated using a 30-second voice sample from a public Teams recording]`,
    redFlags: [
      'Unusual request delivered via voice message rather than official written channel',
      'Asks you to access credentials stored in a shared drive — a policy violation',
      'Creates urgency and invokes an unhappy client to pressure quick action',
      'Asks you to act without getting signed approval — bypasses controls intentionally',
      'Even if the voice sounds real, voice cloning AI can replicate a person\'s voice from a short sample',
      'The manager is "unavailable to confirm" — a classic pressure tactic',
    ],
    educationalContent: `AI voice cloning has made deepfake phone/voicemail attacks highly convincing.

**How to protect yourself:**
1. Establish a "code word" or callback procedure with your manager for sensitive requests
2. Any request involving credentials, data access, or bypassing approval processes requires written confirmation — no exceptions
3. Always call back on the manager's known direct number (not the number that called you)
4. Report suspected deepfake calls to IT Security immediately
5. Remember: voice alone is NOT sufficient authorization for security-sensitive actions

**The rule:** If a voice message asks you to skip normal procedures — it's a red flag, regardless of who the voice sounds like.`,
    clickRate: 19,
  },

  {
    id: 'ps-010',
    name: 'Fake Intune Device Enrollment Required',
    type: 'email',
    difficulty: 'easy',
    category: 'credential_harvest',
    industry: 'microsoft',
    subject: 'ACTION REQUIRED: Enroll your device in Intune by Friday or lose email access',
    senderName: 'IT Security — Device Compliance',
    senderEmail: 'device-compliance@intune-enrollment.help',
    previewText: 'Your device does not meet company policy. Enroll now to maintain access.',
    body: `Hello,

Our records show that your device (Device ID: WS-EMP-04829) has not been enrolled in Microsoft Intune, which is required for all employees to maintain access to company resources.

DEADLINE: This Friday at 5:00 PM

If your device is not enrolled by the deadline, you will lose access to:
• Microsoft Outlook
• Microsoft Teams
• SharePoint and OneDrive
• All company VPN connections

To enroll your device, click the link below and sign in with your company credentials:

[ENROLL MY DEVICE NOW]

If you have already enrolled your device and received this message in error, please disregard. However, if you are unsure, it is safer to complete the enrollment process again.

IT Security Operations`,
    redFlags: [
      'Sender domain "intune-enrollment.help" is not a Microsoft or company domain',
      'Intune enrollment is managed by the IT team and does not require clicking email links',
      'If Intune enrollment was needed, IT would notify you through your existing work email to a known intranet page',
      'The link leads to a fake Microsoft login page to steal your credentials',
      '"If unsure, complete again" is designed to make even careful employees comply',
      'The device ID (WS-EMP-04829) is fabricated — check with IT before trusting any device ID in an email',
    ],
    educationalContent: `Intune enrollment is a real IT process — attackers exploit this familiarity.

**How real Intune enrollment works:**
1. Your IT team sends instructions through your verified work email with links to Microsoft's real portals
2. The Company Portal app is installed by IT or downloaded from the official Microsoft Store
3. You can check your device compliance status directly at https://portal.manage.microsoft.com
4. IT will never ask you to enroll via a link in a cold email with a Friday deadline

**When in doubt:** Open a ticket with IT Support directly through your company's service desk portal.`,
    clickRate: 35,
  },
];

export default phishingScenarios;
