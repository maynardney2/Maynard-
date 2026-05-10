# CyberShield — Phishing Simulation Playbook

## 1. Program Overview

The CyberShield Phishing Simulation Program is a continuous security awareness initiative that tests and trains employees to recognize and report phishing attacks through controlled, safe simulations. This program is a key component of our security culture strategy.

**Goals:**
- Reduce the organization's phishing click rate to below 10% within 12 months
- Increase the phishing report rate to above 70%
- Build a reflexive habit of caution with unsolicited communications
- Provide data-driven insights to target training where it's needed most

**Frequency:** Monthly simulations, or as determined by the security calendar

---

## 2. Legal and Ethical Considerations

- All simulations are authorized by organizational leadership (written approval on file)
- Employees are informed at onboarding that simulations will occur — specific campaign details are not disclosed
- No simulations are designed to humiliate, target specific individuals, or relate to personal sensitive topics
- Post-click educational content is supportive and constructive — not punitive
- Results are used for aggregate training improvement — individual click data shared only with HR for persistent repeat offenders per policy
- Simulations are not used in performance reviews unless required by specific client contracts

---

## 3. Phishing Simulation Templates (10 Templates)

---

### Template 1: Microsoft 365 Password Expiry
**Type:** Email  
**Difficulty:** Easy  
**Category:** Credential Harvesting  
**Target audience:** All employees

**Subject:** ACTION REQUIRED: Your Microsoft 365 password expires in 24 hours

**From display name:** Microsoft Account Team  
**From address:** security-noreply@microsoft-accounts.support *(note: NOT microsoft.com)*

**Email body:**
```
Dear [employee email],

Your Microsoft 365 password is set to expire in 24 hours.

To avoid losing access to your email, Teams, and SharePoint files, 
please reset your password immediately.

[RESET MY PASSWORD NOW]  →  http://reset-m365-password.click/login

If you do not reset within 24 hours, your account will be locked.

Microsoft Account Security
```

**Landing page (educational):** "You've been phished! Here's what to look for..."

**Red flags:**
1. Sender domain is `microsoft-accounts.support` — NOT microsoft.com
2. Artificial urgency: "24 hours"
3. Microsoft never proactively sends password reset emails
4. Link goes to a non-Microsoft domain (visible on hover)
5. Generic greeting uses email address, not your name

**Post-click education:** Module → "Recognizing Microsoft 365 Phishing"  
**Expected click rate (untrained):** 25–35%

---

### Template 2: IT Helpdesk Credential Reset
**Type:** Email  
**Difficulty:** Medium  
**Category:** Credential Harvesting  
**Target audience:** All employees

**Subject:** IT Support: Action needed — Account security verification (Ticket #IT-48291)

**From display name:** IT Helpdesk Team  
**From address:** helpdesk@company-support.net *(note: NOT your company domain)*

**Email body:**
```
Hi,

We detected an unusual sign-in attempt on your account from an 
unrecognized device in Manila (IP: 103.52.162.14) at 2:47 AM.

Ticket Reference: #IT-48291

Please verify your identity within 2 hours to prevent lockout:
[VERIFY MY ACCOUNT]  →  http://verify-account-security.net/login

If you don't verify, your account will be disabled.

IT Security Operations
```

**Red flags:**
1. Sender domain is not your real company domain
2. Real IT uses the official ticketing system — not cold emails
3. Pressure tactic: "2 hours"
4. Fabricated ticket number to appear legitimate
5. Link goes to external site

**Post-click education:** Module → "Social Engineering and IT Impersonation"

---

### Template 3: Urgent Client Data Request
**Type:** Email  
**Difficulty:** Hard  
**Category:** Social Engineering  
**Target audience:** Operations / BPO staff

**Subject:** URGENT: Client XYZ Corp — Data request for audit by EOD

**From display name:** Mark Rivera — Account Director  
**From address:** mark.rivera@xyzcorp-global.com *(lookalike client domain)*

**Email body:**
```
Hi,

We have an urgent compliance audit today at 6PM and need the 
customer data export discussed with your manager last week.

Please export Account Group 47-B records and upload here:
[UPLOAD TO SECURE DROPBOX]

This is time-sensitive. Your manager James has approved this verbally.

Mark Rivera | XYZ Corp Global
```

**Red flags:**
1. Client domain may not match the real client's official domain
2. External Dropbox — never an approved transfer method
3. "Verbal approval you can't verify" — social engineering
4. Urgency with external upload request

**Post-click education:** Module → "BPO Data Protection and Client Request Verification"

---

### Template 4: HR Policy Update
**Type:** Email  
**Difficulty:** Medium  
**Category:** Malware / Credential Harvest  
**Target audience:** All employees

**Subject:** Important: Updated Employee Benefits & Policy Documents — Action Required

**From display name:** HR Department  
**From address:** hr-updates@company-hr-portal.com *(not your real company domain)*

**Email body:**
```
Dear Team Member,

Several important policies are effective June 1. All employees must 
acknowledge before May 31 or portal access may be restricted.

[REVIEW & ACKNOWLEDGE POLICIES]

HR Department | People & Culture
```

**Red flags:**
1. Sender domain is not your real company domain
2. Always access HR portal via bookmark, not email links
3. Deadline with access threat
4. "People & Culture" — verify this is your actual HR branding

**Post-click education:** Module → "Phishing Red Flags — HR Impersonation"

---

### Template 5: CEO Gift Card / BEC
**Type:** Email  
**Difficulty:** Hard  
**Category:** Social Engineering  
**Target audience:** Finance / Operations / Executive Assistants

**Subject:** Quick favor needed — confidential

**From display name:** CEO [CEO Name]  
**From address:** [ceo.name]@company-ceo.org *(lookalike CEO domain)*

**Email body:**
```
Hi,

I'm in a board meeting and can't take calls. I need you to 
purchase 4x $250 Amazon gift cards for a client initiative.

Buy them now and send me photos of the codes — I'll reimburse 
through payroll. Don't mention to anyone yet — it's a surprise.

Please confirm you can help.

[CEO Name]
```

**Red flags:**
1. CEO's real email is @yourcompany.com — not @company-ceo.org
2. Gift cards are NEVER a legitimate business request
3. "Keep it secret" = major red flag
4. "Can't take calls" prevents verification

**Post-click education:** Module → "Business Email Compromise and Executive Impersonation"

---

### Template 6: QR Code Phishing (Physical)
**Type:** QR Code  
**Difficulty:** Hard  
**Category:** Credential Harvesting  
**Target audience:** All employees (in-office)

**Execution:** Print and place posters in break rooms, elevators, or bulletin boards 1 week before running the simulation.

**Poster content:**
```
🎉 Employee Appreciation Month!

Scan the QR code to enter our lucky draw:
• Free lunch for 2 weeks
• Amazon vouchers
• Extra leave day

All employees eligible. Scan now — only 50 spots left!
```

**QR code destination:** CyberShield educational landing page with "You've been QRished!" message

**Red flags:**
1. Physical QR codes can be placed by anyone
2. Preview the URL before scanning
3. Verify prize draws through official HR email or Teams
4. Never enter login credentials via a QR code

---

### Template 7: SMS Smishing
**Type:** SMS  
**Difficulty:** Medium  
**Category:** Credential Harvesting  
**Target audience:** Employees with registered work mobile numbers

**SMS body:**
```
COMPANY IT ALERT: Suspicious login detected. Verify identity now to 
prevent lockout: https://co-verify.net/account-check?id=EMP4829
Reply STOP to opt out.
```

**Red flags:**
1. IT does not send verification links via personal SMS
2. Link domain is not your company domain
3. "Reply STOP" mimics marketing SMS — IT doesn't offer opt-outs
4. EMP number in URL is fabricated

---

### Template 8: Vendor Invoice with Malicious Attachment
**Type:** Email  
**Difficulty:** Medium  
**Category:** Malware  
**Target audience:** Finance / Procurement

**Subject:** Invoice #INV-2024-0892 — Payment Due in 7 Days

**From display name:** Accounts Payable — TechSupplies Ltd  
**From address:** invoices@techsupp1ies-ltd.com *(uses number 1 instead of l)*

**Attachment:** Fake Excel file titled "INV-2024-0892-breakdown.xlsm" (macro-enabled)

**Email body:**
```
Please find attached Invoice #INV-2024-0892 for April services.
Amount: $4,750.00 | Due: May 30, 2024

The Excel file contains itemized breakdown and banking details.

Sarah Chen | Accounts Receivable | TechSupplies Ltd
```

**Red flags:**
1. Domain typo: techsupp**1**ies-ltd.com (number 1 instead of letter l)
2. Unexpected invoice — verify in procurement system
3. Excel (.xlsm) with macros — never enable macros in unexpected files
4. Banking details in attachment = payment fraud risk

---

### Template 9: AI Deepfake Voice (Tabletop Scenario)
**Type:** Voice (tabletop exercise, not live simulation)  
**Difficulty:** Hard  
**Category:** Social Engineering  
**Target audience:** Finance, IT, HR

**Scenario for tabletop exercise:**

> An employee receives a voicemail from what sounds exactly like their manager asking them to action a data request or process a transfer without waiting for written approval. The voice is AI-generated.

**Discussion questions for tabletop:**
1. How would you verify this request before acting?
2. What is your callback verification procedure?
3. Would you feel comfortable slowing down a request from a senior leader?

**Training point:** Establish code words for sensitive requests. Voice alone is not authorization.

---

### Template 10: Fake Intune Enrollment Required
**Type:** Email  
**Difficulty:** Easy  
**Category:** Credential Harvesting  
**Target audience:** All employees

**Subject:** ACTION REQUIRED: Enroll your device in Intune by Friday or lose email access

**From display name:** IT Security — Device Compliance  
**From address:** device-compliance@intune-enrollment.help

**Email body:**
```
Your device has not been enrolled in Microsoft Intune.

DEADLINE: This Friday at 5:00 PM

Without enrollment, you will lose access to Outlook, Teams, 
SharePoint, and VPN.

[ENROLL MY DEVICE NOW]
```

**Red flags:**
1. Domain is not Microsoft or your company domain
2. Intune enrollment does not require clicking email links
3. IT would notify you through your actual work email to a known intranet URL
4. The link leads to a fake Microsoft login

---

## 4. Post-Click Educational Response Workflow

**Immediate (within 2 minutes of click):**
1. Browser redirects to educational landing page (CyberShield-hosted)
2. Page explains: "This was a simulation. Here's what happened. Here's what to look for."
3. Employee offered 5-minute microlearning right there

**Same day:**
4. Automated educational email sent (see Template 8 in EMPLOYEE_COMMUNICATIONS.md)
5. Employee's "Phishing Awareness" score updated in CyberShield

**Within 7 days:**
5. Targeted course assignment: relevant phishing module
6. Manager notified via dashboard (aggregate team data — not individual names unless policy violation)

**For repeat clickers (3+ campaigns):**
7. 1:1 security coaching session with IT Security or HR
8. Additional mandatory microlearning assignment
9. Flagged in risk register for enhanced monitoring

---

## 5. Results Analysis Guide

After each campaign, review:

| Metric | What to Look For | Action if Concerning |
|---|---|---|
| Overall click rate | > 25% is concerning | Intensify training; add targeted module |
| Click rate by department | Departments > 30% | Department-specific briefing from manager |
| Report rate | < 30% is concerning | Promote "Report Phishing" button more actively |
| Time to first click | < 5 minutes = reactive | Slow-down training: verify before you click |
| Repeat clickers | Any employee on 3rd+ campaign | 1:1 coaching |

---

## 6. Improvement Tracking

Track these metrics month-over-month per campaign:

- Click rate trend (should decrease over time)
- Report rate trend (should increase over time)
- Time-to-report trend (should decrease over time)
- Repeat clicker percentage (should decrease over time)

**Benchmark goals (12-month program):**
- Month 1: Baseline (expect 25–35% click rate)
- Month 3: < 20% click rate
- Month 6: < 15% click rate
- Month 12: < 10% click rate; > 60% report rate
