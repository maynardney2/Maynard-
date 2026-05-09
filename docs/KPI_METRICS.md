# CyberShield LMS — KPI Metrics & Measurement Framework

## 1. Training Metrics

### 1.1 Training Completion Rate

**Definition:** Percentage of assigned employees who have completed required training within the defined deadline.

**Formula:** (Employees who completed required training / Total employees assigned required training) × 100

| Rating | Threshold | Action |
|---|---|---|
| 🟢 Green | ≥ 95% | Maintain, celebrate success |
| 🟡 Amber | 80–94% | Identify at-risk employees, send reminders |
| 🔴 Red | < 80% | Escalate to department managers, mandatory follow-up |

**Target:** 95% within 30 days of assignment  
**Measurement frequency:** Weekly during active campaigns, monthly ongoing  
**Reported to:** All Managers (department view), Admin (full view), Executive (aggregate)

---

### 1.2 Average Quiz Score

**Definition:** Mean score across all quiz attempts for a given period.

**Formula:** Sum of all quiz scores / Total quiz attempts

| Rating | Threshold | Interpretation |
|---|---|---|
| 🟢 Green | ≥ 80% | Content is understood, training is effective |
| 🟡 Amber | 65–79% | Some topics need reinforcement |
| 🔴 Red | < 65% | Content revision or additional training required |

**Segmentation:** By course, by department, by role, by new hire cohort  
**Action trigger (Red):** Review course content for clarity; schedule facilitated review sessions

---

### 1.3 First-Attempt Pass Rate

**Definition:** Percentage of quiz attempts where the employee passed on their first try.

**Target:** ≥ 75%  
**Significance:** High first-attempt pass rates indicate effective training content and engaged learners.  
**Low rate action:** Review question difficulty, check for ambiguous questions, evaluate content quality

---

### 1.4 Training Hours Per Employee Per Quarter

**Definition:** Total active learning time completed per employee per quarter.

**Recommended benchmark:** 4–6 hours per quarter for all employees  
**IT staff benchmark:** 8–10 hours per quarter  
**Measurement:** Sum of course durations completed per employee

---

### 1.5 New Hire Training Completion (Onboarding)

**Definition:** Completion of mandatory onboarding security training within 14 days of start date.

**Target:** 100% within 14 days  
**Automated trigger:** Assignment created automatically on first login  
**Manager alert:** Sent at Day 10 if not completed

---

## 2. Phishing Simulation Metrics

### 2.1 Click Rate (Primary Phishing KPI)

**Definition:** Percentage of targeted employees who clicked the simulated phishing link.

**Formula:** (Employees who clicked / Total employees targeted) × 100

| Rating | Threshold | Industry Context |
|---|---|---|
| 🟢 Excellent | < 5% | Best-in-class security culture |
| 🟢 Good | 5–10% | Above industry average |
| 🟡 Average | 10–25% | Industry average (untrained) |
| 🔴 Concerning | 25–40% | Below average — intensify training |
| 🔴 Critical | > 40% | Immediate intervention required |

**Baseline industry average (BPO sector):** ~25–35% before training programs  
**Target after 6 months of program:** < 10%  
**Target after 12 months:** < 5%

---

### 2.2 Phishing Report Rate

**Definition:** Percentage of simulated phishing emails that were actively reported by employees.

**Formula:** (Employees who reported the phishing / Total employees targeted) × 100

**Target:** > 70% of simulations reported using the Report Phishing button  
**Why this matters:** Reporting = active participation in security, not just passive avoidance

| Rating | Threshold |
|---|---|
| 🟢 Green | ≥ 70% |
| 🟡 Amber | 40–69% |
| 🔴 Red | < 40% |

---

### 2.3 Time-to-Report

**Definition:** Average time between email delivery and employee reporting it as phishing.

**Target:** < 30 minutes  
**Excellence:** < 10 minutes  
**Significance:** Faster reporting enables faster incident containment for real attacks

---

### 2.4 Repeat Clicker Rate

**Definition:** Percentage of employees who clicked phishing links in 2 or more consecutive simulations.

**Target:** < 5%  
**Action for repeat clickers:** Mandatory 1:1 security coaching, additional targeted microlearning, manager notification

---

### 2.5 Department Risk Score (Phishing)

**Definition:** Composite phishing risk score per department based on click rate, report rate, and repeat clicks.

**Calculation:** (Click Rate × 0.5) + (100 - Report Rate × 0.3) + (Repeat Click Rate × 0.2)  
**Range:** 0 (best) to 100 (worst)  
**Used for:** Targeted training deployment, department-level management reporting

---

## 3. Compliance Metrics

### 3.1 Overall Compliance Score

**Definition:** Weighted composite score representing the organization's training compliance posture.

**Weighting:**
- Training Completion Rate: 35%
- Average Quiz Score: 20%
- Policy Acknowledgment Rate: 20%
- MFA Adoption Rate: 15%
- Phishing Report Rate: 10%

**Target:** ≥ 90% for SOC 2 and ISO 27001 audit readiness  
**Reported:** Monthly to executive team; quarterly in formal compliance report

---

### 3.2 Policy Acknowledgment Rate

**Definition:** Percentage of employees who have acknowledged all current required policies.

**Target:** 100% within 30 days of policy publication  
**Grace period for new employees:** 14 days  
**Escalation:** Manager alerted at Day 21 for any outstanding acknowledgments

---

### 3.3 Certificate Validity Rate

**Definition:** Percentage of employees holding a current (non-expired) certificate for each required course.

**Target:** 100% valid certificates at all times  
**Certificate validity period:** 12 months from completion  
**Auto-notification:** 30 days and 7 days before expiry

---

### 3.4 MFA Adoption Rate

**Definition:** Percentage of active employee accounts with MFA enabled.

**Target:** 100% — no exceptions  
**Measurement:** Pulled from Azure AD report via Microsoft Graph API  
**Action for non-adoption:** Account access restricted until MFA is configured

---

### 3.5 Overdue Training Rate

**Definition:** Percentage of employees with at least one required training assignment past its due date.

**Target:** 0%  
**Amber trigger:** ≥ 5% overdue → automated reminders intensified  
**Red trigger:** ≥ 15% overdue → management escalation

---

## 4. Security Culture Metrics

### 4.1 Security Score Distribution

**Definition:** Distribution of employees across security score bands.

| Band | Score Range | Target Distribution |
|---|---|---|
| High | 80–100 | ≥ 40% of employees |
| Medium | 60–79 | ≤ 45% of employees |
| Low | 0–59 | ≤ 15% of employees |

**Trend goal:** Shift distribution toward High band month-over-month

---

### 4.2 Streak Maintenance Rate

**Definition:** Percentage of employees actively maintaining a learning streak (completing at least one module per week).

**Target:** ≥ 30% engaged in active streaks  
**Significance:** Streaks are a proxy for voluntary engagement beyond mandatory training

---

### 4.3 Voluntary Training Engagement

**Definition:** Percentage of employees who complete optional (non-assigned) courses.

**Target:** ≥ 20% complete at least one optional course per quarter  
**Significance:** High voluntary engagement = strong security culture

---

## 5. Reporting Schedule

| Report | Frequency | Audience | Format |
|---|---|---|---|
| Training Activity Summary | Weekly | Admins | Email digest + Dashboard |
| Phishing Campaign Results | Per campaign | Admins, Security Team | Dashboard + PDF |
| Department Compliance | Monthly | Department Managers | Email PDF |
| Executive Security Summary | Monthly | C-Level / CISO | PDF (1 page) |
| Full Compliance Report | Quarterly | Compliance Team, Auditors | Detailed PDF |
| Risk Assessment | Quarterly | Security Team, Leadership | Dashboard + PDF |
| Annual Program Review | Annual | Executive Team | Presentation + Data |

---

## 6. RAG Status Definitions

| Metric | 🟢 Green | 🟡 Amber | 🔴 Red |
|---|---|---|---|
| Training Completion | ≥ 95% | 80–94% | < 80% |
| Quiz Score Average | ≥ 80% | 65–79% | < 65% |
| Phishing Click Rate | < 10% | 10–25% | > 25% |
| Phishing Report Rate | ≥ 70% | 40–69% | < 40% |
| Policy Acknowledgment | ≥ 95% | 80–94% | < 80% |
| MFA Adoption | 100% | 95–99% | < 95% |
| Overall Compliance Score | ≥ 90% | 75–89% | < 75% |

---

## 7. Industry Benchmarks

| Metric | Industry Average | Top Quartile | CyberShield Target |
|---|---|---|---|
| Training Completion | 72% | 95% | 95% |
| Phishing Click Rate (pre-training) | 32% | N/A | Baseline only |
| Phishing Click Rate (after 12 months) | 14% | 5% | < 10% |
| MFA Adoption | 68% | 98% | 100% |
| Time-to-report phishing | 4 hours | 15 minutes | < 30 minutes |

*Sources: Proofpoint State of the Phish 2024, KnowBe4 Phishing Benchmarks 2024, Microsoft Digital Defense Report 2023*

---

## 8. Executive One-Page Dashboard — Description

The monthly executive summary includes:

1. **Compliance Score Gauge** — current score with trend arrow (vs. last month)
2. **Traffic Light Summary** — 6 key metrics each with RAG status
3. **Top Risk Insight** — one sentence: e.g., "Finance department has a 28% phishing click rate — highest in the organization"
4. **Win of the Month** — e.g., "Operations department achieved 100% policy acknowledgment"
5. **Action Required** — one or two specific asks from leadership
6. **Year-over-Year Chart** — overall compliance trend (12 months)
7. **Next Month's Focus** — featured training theme and planned phishing campaign type
