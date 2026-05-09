# Security Incident Response Policy

**Document Number:** SEC-POL-004  
**Version:** 2.2  
**Effective Date:** January 1, 2024  
**Review Date:** January 1, 2025  
**Owner:** Information Security Team

---

## 1. Purpose

This Policy establishes the framework for identifying, reporting, containing, investigating, and recovering from security incidents. A rapid and well-coordinated response minimizes damage, reduces recovery time and costs, and fulfills regulatory and contractual notification obligations.

---

## 2. Incident Classification

| Level | Name | Examples | Initial Response Time |
|---|---|---|---|
| **P1** | Critical | Ransomware, confirmed data breach of client PII, active intrusion | 15 minutes |
| **P2** | High | Phishing email clicked with credentials entered, unauthorized privileged access, malware on endpoint | 1 hour |
| **P3** | Medium | Suspected phishing (not confirmed), lost device, policy violation | 4 hours |
| **P4** | Low | Spam increase, single failed login, lost USB (no data) | 24 hours |

---

## 3. Incident Response Team

| Role | Responsibilities |
|---|---|
| **Incident Commander** (CISO/Security Manager) | Leads response, makes escalation decisions, approves communications |
| **Security Analyst** (IT Security Team) | Technical investigation, containment, evidence collection |
| **IT Operations** | Implements technical containment and recovery actions |
| **Legal/Compliance** | Assesses regulatory obligations, manages legal hold |
| **HR** | Handles employee-related incidents, witnesses for disciplinary matters |
| **Communications** (if applicable) | Manages client and external notifications |

---

## 4. Incident Response Phases

### Phase 1: Identify

**Goal:** Detect and confirm an incident is occurring.

**Detection sources:**
- Employee reports (most common) — report to security@company.com or call the IT Security hotline
- EDR/antivirus alerts (Microsoft Defender for Endpoint)
- SIEM alerts (Azure Sentinel)
- Microsoft Defender for Office 365 alerts
- External reports (client, law enforcement, security researcher)

**Initial triage questions:**
1. What systems or data are affected?
2. When did it start? Is it ongoing?
3. Is client data potentially involved?
4. Is this isolated or spreading?

---

### Phase 2: Contain

**Goal:** Stop the spread and limit damage immediately.

**Short-term containment (first 30 minutes for P1/P2):**
- Disconnect affected endpoint from network (unplug cable or disable Wi-Fi) — do NOT power off
- Disable compromised user accounts in Azure AD
- Block malicious IP addresses or domains in firewall and email filter
- Suspend phishing campaign (if related to simulation)
- Revoke compromised OAuth tokens or API keys

**Long-term containment:**
- Rebuild compromised systems from clean images if necessary
- Implement additional monitoring on related systems
- Require password reset for all potentially affected accounts

---

### Phase 3: Eradicate

**Goal:** Remove the threat completely from the environment.

- Identify and remove malware, backdoors, or unauthorized tools
- Close the vulnerability or misconfiguration that enabled the attack
- Remove any attacker persistence mechanisms (scheduled tasks, registry entries, rogue accounts)
- Confirm through EDR and SIEM that no indicators of compromise remain
- Document all actions taken for forensic record

---

### Phase 4: Recover

**Goal:** Restore normal operations safely.

- Restore affected systems from clean backups (verify backup integrity before restore)
- Re-enable user access after credential reset and verification
- Monitor restored systems closely for 72 hours post-recovery
- Communicate system restoration status to affected users and managers
- Verify all security controls are functioning on restored systems

---

### Phase 5: Lessons Learned

**Goal:** Prevent recurrence and improve future response.

- Post-incident review meeting within 5 business days of incident closure
- Root cause analysis: how did the incident occur?
- Timeline reconstruction: from initial access to detection to containment
- What worked well? What needs improvement?
- Update runbooks, playbooks, and training based on findings
- Report to management with action items and owners

---

## 5. Employee Reporting Procedure

**If you suspect or discover a security incident:**

1. **Do not try to fix it yourself** — you may destroy forensic evidence or make it worse
2. **Note the time** you first noticed the issue
3. **Do not discuss the incident on email or Teams** — use the phone
4. **Call the IT Security Hotline immediately:** [Insert emergency number]
5. **Alternatively:** Email security@company.com with subject "INCIDENT: [brief description]"
6. **If ransomware:** Disconnect from network immediately (unplug cable / disable Wi-Fi), then call IT
7. **If phishing email:** Use the "Report Phishing" button in Outlook, then delete the email

**You will not be punished for reporting an incident in good faith.** Early reporting is the most important factor in minimizing damage.

---

## 6. Escalation Matrix

| Incident Type | First Contact | Escalate to | Escalate if |
|---|---|---|---|
| Phishing email (not clicked) | Report button in Outlook | — | — |
| Phishing clicked (no credentials entered) | IT Helpdesk | Security Analyst | If malware suspected |
| Phishing clicked (credentials entered) | **IT Security Hotline** | Incident Commander | Immediately |
| Ransomware / malware active | **IT Security Hotline** | Incident Commander + Legal | Immediately |
| Client data potentially exposed | **IT Security Hotline** | Incident Commander + Legal + CISO | Immediately |
| Lost or stolen device | IT Helpdesk | Security Analyst | If device was unencrypted |
| Insider threat suspected | HR + Security | Legal | If criminal activity suspected |

---

## 7. Client Notification Obligations (BPO-Specific)

For BPO organizations, client notification is a contractual and regulatory obligation:

- **Contractual:** Review each client's MSA/SOW for breach notification timelines (typically 24–72 hours)
- **Regulatory:** GDPR Article 33 requires notification to supervisory authority within 72 hours if EU citizen data is involved
- **HIPAA:** If US health data (PHI) is involved, notification within 60 days to affected individuals, OCR notification required
- **PCI-DSS:** If cardholder data is involved, notify acquiring bank and card brands immediately

**Notification escalation:** Legal and the Account Management team must be involved in all client notifications. Do not contact clients directly about security incidents without Legal approval.

---

## 8. Evidence Preservation

- Do not power off affected devices — volatile memory may contain critical evidence
- Preserve logs: system logs, application logs, network logs, and email headers
- Take screenshots of any ransom notes, error messages, or suspicious activity
- Document your actions and timestamps — this creates the chain of custody record
- Do not access or modify files that may be evidence without Security team guidance

---

## 9. Communication Templates

### Employee Notification (Internal — P1/P2)
> Subject: IMPORTANT: Security Incident — Action Required
> 
> We are currently managing a security incident that may affect [system/service]. IT Security is investigating. 
> Please do not [specific action — e.g., open links from unknown senders / access X system until further notice].
> Your cooperation is essential. Updates will follow every [30 minutes / 2 hours]. 
> Contact: security@company.com | Hotline: [number]

### Manager Notification
> Subject: Security Incident Update — [Severity Level]
> 
> Incident Reference: [ID]  
> Status: [Investigating / Contained / Recovering]  
> Systems Affected: [list]  
> Estimated Impact: [description]  
> Next Update: [time]  
> Action Required from Your Team: [specific instructions]

---

*Incident Response Runbooks (per incident type) are maintained in the IT Security SharePoint and reviewed quarterly.*
