-- =============================================================================
-- CyberShield LMS - Seed Data
-- Run AFTER schema.sql
-- =============================================================================

-- =============================================================================
-- DEPARTMENTS
-- =============================================================================

INSERT INTO departments (name, code, description, is_active) VALUES
    ('Operations',    'OPS',  'Core BPO operations team handling client processes and workflows', TRUE),
    ('IT & Support',  'IT',   'Information technology, helpdesk, and infrastructure support', TRUE),
    ('Human Resources', 'HR', 'Recruitment, onboarding, employee relations and payroll', TRUE),
    ('Finance',       'FIN',  'Accounts payable, accounts receivable, payroll processing and reporting', TRUE),
    ('Compliance',    'COMP', 'Regulatory compliance, audit, and risk management', TRUE);

-- =============================================================================
-- USERS
-- Admin user created first so managers can reference departments.manager_id
-- Password hash is bcrypt of 'CyberShield@Admin2024!' — replace in production
-- =============================================================================

-- Admin
INSERT INTO users (id, email, password_hash, first_name, last_name, role, employee_id, security_score, is_active, mfa_enabled) VALUES
    ('00000000-0000-0000-0000-000000000001',
     'admin@cybershield.local',
     '$2b$12$PLACEHOLDER_ADMIN_HASH_REPLACE_ME_IN_PROD',
     'System', 'Administrator',
     'admin', 'EMP-ADMIN-001', 95, TRUE, TRUE);

-- Managers
INSERT INTO users (id, email, password_hash, first_name, last_name, role, department_id, employee_id, security_score, is_active, mfa_enabled) VALUES
    ('00000000-0000-0000-0000-000000000002',
     'maria.santos@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'Maria', 'Santos',
     'manager',
     (SELECT id FROM departments WHERE code = 'OPS'),
     'EMP-OPS-001', 88, TRUE, TRUE),

    ('00000000-0000-0000-0000-000000000003',
     'james.reyes@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'James', 'Reyes',
     'manager',
     (SELECT id FROM departments WHERE code = 'IT'),
     'EMP-IT-001', 92, TRUE, TRUE),

    ('00000000-0000-0000-0000-000000000004',
     'ana.delacruز@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'Ana', 'Dela Cruz',
     'manager',
     (SELECT id FROM departments WHERE code = 'COMP'),
     'EMP-COMP-001', 90, TRUE, TRUE);

-- Assign department managers
UPDATE departments SET manager_id = '00000000-0000-0000-0000-000000000002' WHERE code = 'OPS';
UPDATE departments SET manager_id = '00000000-0000-0000-0000-000000000003' WHERE code = 'IT';
UPDATE departments SET manager_id = '00000000-0000-0000-0000-000000000004' WHERE code = 'COMP';

-- IT Staff
INSERT INTO users (id, email, password_hash, first_name, last_name, role, department_id, employee_id, security_score, is_active, mfa_enabled) VALUES
    ('00000000-0000-0000-0000-000000000005',
     'carlo.mendoza@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'Carlo', 'Mendoza',
     'it_staff',
     (SELECT id FROM departments WHERE code = 'IT'),
     'EMP-IT-002', 85, TRUE, TRUE);

-- Employees (spread across departments)
INSERT INTO users (id, email, password_hash, first_name, last_name, role, department_id, employee_id, security_score, is_active, mfa_enabled) VALUES
    ('00000000-0000-0000-0000-000000000006',
     'grace.villanueva@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'Grace', 'Villanueva',
     'employee',
     (SELECT id FROM departments WHERE code = 'OPS'),
     'EMP-OPS-002', 72, TRUE, FALSE),

    ('00000000-0000-0000-0000-000000000007',
     'rodel.campos@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'Rodel', 'Campos',
     'employee',
     (SELECT id FROM departments WHERE code = 'OPS'),
     'EMP-OPS-003', 65, TRUE, FALSE),

    ('00000000-0000-0000-0000-000000000008',
     'liza.tan@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'Liza', 'Tan',
     'employee',
     (SELECT id FROM departments WHERE code = 'HR'),
     'EMP-HR-001', 78, TRUE, FALSE),

    ('00000000-0000-0000-0000-000000000009',
     'paul.aquino@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'Paul', 'Aquino',
     'employee',
     (SELECT id FROM departments WHERE code = 'HR'),
     'EMP-HR-002', 55, TRUE, FALSE),

    ('00000000-0000-0000-0000-000000000010',
     'nina.castillo@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'Nina', 'Castillo',
     'employee',
     (SELECT id FROM departments WHERE code = 'FIN'),
     'EMP-FIN-001', 82, TRUE, TRUE),

    ('00000000-0000-0000-0000-000000000011',
     'mark.garcia@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'Mark', 'Garcia',
     'employee',
     (SELECT id FROM departments WHERE code = 'FIN'),
     'EMP-FIN-002', 48, TRUE, FALSE),

    ('00000000-0000-0000-0000-000000000012',
     'rose.bautista@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'Rose', 'Bautista',
     'employee',
     (SELECT id FROM departments WHERE code = 'COMP'),
     'EMP-COMP-002', 91, TRUE, TRUE),

    ('00000000-0000-0000-0000-000000000013',
     'kevin.lim@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'Kevin', 'Lim',
     'employee',
     (SELECT id FROM departments WHERE code = 'OPS'),
     'EMP-OPS-004', 60, TRUE, FALSE),

    ('00000000-0000-0000-0000-000000000014',
     'diana.ong@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'Diana', 'Ong',
     'employee',
     (SELECT id FROM departments WHERE code = 'IT'),
     'EMP-IT-003', 87, TRUE, TRUE),

    ('00000000-0000-0000-0000-000000000015',
     'ben.flores@cybershield.local',
     '$2b$12$PLACEHOLDER_HASH_REPLACE_ME_IN_PROD',
     'Ben', 'Flores',
     'employee',
     (SELECT id FROM departments WHERE code = 'FIN'),
     'EMP-FIN-003', 40, TRUE, FALSE);

-- =============================================================================
-- COURSES (20 courses, 4 per category)
-- =============================================================================

INSERT INTO courses (id, title, slug, description, long_description, category, duration_minutes, difficulty, passing_score, xp_reward, is_required, is_active, version, created_by) VALUES

-- CORE SECURITY (5 courses)
('10000000-0000-0000-0000-000000000001',
 'Password Security & MFA Essentials',
 'password-security-mfa-essentials',
 'Learn to create strong passwords, manage credentials securely, and protect accounts with multi-factor authentication.',
 'This foundational course covers NIST SP 800-63B password guidelines, passphrase construction, password manager usage, and all major MFA types. Employees will understand why password hygiene is the first line of defense against account takeover.',
 'core_security', 30, 'beginner', 80, 150, TRUE, TRUE, '2.1.0',
 '00000000-0000-0000-0000-000000000001'),

('10000000-0000-0000-0000-000000000002',
 'Phishing & Social Engineering Defense',
 'phishing-social-engineering-defense',
 'Identify and report phishing emails, smishing, vishing, and social engineering attempts targeting BPO employees.',
 'Attackers specifically target BPO workers because they hold access to client data and financial systems. This course covers the anatomy of phishing attacks, real-world BPO-specific scenarios, recognition techniques, and proper reporting procedures.',
 'core_security', 35, 'beginner', 80, 175, TRUE, TRUE, '2.0.0',
 '00000000-0000-0000-0000-000000000001'),

('10000000-0000-0000-0000-000000000003',
 'Email Security & Safe Communication',
 'email-security-safe-communication',
 'Master safe email practices including header analysis, attachment handling, BEC attack recognition, and secure forwarding.',
 'Email remains the primary attack vector for cybercriminals. This course teaches employees to critically evaluate every email they receive, understand the risks of attachments and links, recognize Business Email Compromise (BEC) patterns, and apply safe-forwarding practices.',
 'core_security', 25, 'beginner', 75, 125, TRUE, TRUE, '1.5.0',
 '00000000-0000-0000-0000-000000000001'),

('10000000-0000-0000-0000-000000000004',
 'Remote Work Security',
 'remote-work-security',
 'Secure your home office: VPN requirements, endpoint management, home network hardening, and safe use of personal devices.',
 'With hybrid and remote work now standard in BPO environments, employees must understand the additional security responsibilities that come with working outside the corporate network perimeter.',
 'core_security', 30, 'intermediate', 80, 150, TRUE, TRUE, '1.3.0',
 '00000000-0000-0000-0000-000000000001'),

('10000000-0000-0000-0000-000000000005',
 'Physical Security Awareness',
 'physical-security-awareness',
 'Prevent tailgating, protect your workstation, manage visitors, and maintain a secure physical workspace.',
 'Cybersecurity is not only a digital concern. Physical breaches — someone walking into a secure area, shoulder-surfing a screen, or stealing an unlocked device — can be just as damaging. This course covers the physical security controls every employee must practice daily.',
 'core_security', 20, 'beginner', 75, 100, TRUE, TRUE, '1.2.0',
 '00000000-0000-0000-0000-000000000001'),

-- BPO SECURITY (4 courses)
('20000000-0000-0000-0000-000000000001',
 'PII Handling & Data Privacy',
 'pii-handling-data-privacy',
 'Understand what constitutes PII, your obligations under GDPR and PDPA, data minimization principles, and secure disposal.',
 'BPO employees routinely handle personally identifiable information belonging to clients and their end customers. This course explains what PII is, the legal frameworks governing its use, and the practical day-to-day behaviors required to protect it.',
 'bpo_security', 40, 'intermediate', 85, 200, TRUE, TRUE, '1.4.0',
 '00000000-0000-0000-0000-000000000001'),

('20000000-0000-0000-0000-000000000002',
 'PCI-DSS Awareness for Agents',
 'pci-dss-awareness-agents',
 'Understand cardholder data handling rules, prohibited storage practices, and your personal responsibilities under PCI-DSS.',
 'Any employee who touches payment card data — even verbally — has PCI-DSS obligations. This course explains the Payment Card Industry Data Security Standard in plain language, focusing on what agents can and cannot do with cardholder information.',
 'bpo_security', 35, 'intermediate', 85, 175, TRUE, TRUE, '2.0.0',
 '00000000-0000-0000-0000-000000000001'),

('20000000-0000-0000-0000-000000000003',
 'Screen Privacy & Data Exposure Prevention',
 'screen-privacy-data-exposure',
 'Protect sensitive data from visual exposure: privacy screens, auto-lock policies, screen capture controls, and desk hygiene.',
 'In a busy BPO floor or home-office environment, sensitive data can be seen by unintended people. This course covers the tools and habits employees must use to prevent unauthorized viewing of client data.',
 'bpo_security', 20, 'beginner', 75, 100, FALSE, TRUE, '1.1.0',
 '00000000-0000-0000-0000-000000000001'),

('20000000-0000-0000-0000-000000000004',
 'Client Data Compliance & NDA Obligations',
 'client-data-compliance-nda',
 'Understand NDA obligations, client-specific data handling rules, breach notification procedures, and compliance consequences.',
 'Every employee working on a client account is bound by contractual and legal data-handling obligations. This course explains what those obligations mean in practice, including what constitutes a data breach and how to respond.',
 'bpo_security', 30, 'intermediate', 85, 150, TRUE, TRUE, '1.2.0',
 '00000000-0000-0000-0000-000000000001'),

-- MICROSOFT SECURITY (4 courses)
('30000000-0000-0000-0000-000000000001',
 'Microsoft 365 Safe Use',
 'microsoft-365-safe-use',
 'Use Teams, Outlook, and M365 apps securely: data classification, safe sharing practices, and guest access risks.',
 'Microsoft 365 is the collaboration backbone of most BPO organizations. This course shows employees how to share files, communicate, and collaborate without exposing sensitive data to unauthorized parties.',
 'microsoft_security', 30, 'beginner', 75, 150, FALSE, TRUE, '1.3.0',
 '00000000-0000-0000-0000-000000000001'),

('30000000-0000-0000-0000-000000000002',
 'OneDrive & SharePoint Security',
 'onedrive-sharepoint-security',
 'Apply permission best practices, understand external sharing risks, and configure DLP-compliant sharing in SharePoint and OneDrive.',
 'SharePoint and OneDrive are frequent sources of data leaks when employees set permissions too broadly or share links externally without authorization. This course provides the practical knowledge to use both platforms securely.',
 'microsoft_security', 25, 'intermediate', 80, 125, FALSE, TRUE, '1.1.0',
 '00000000-0000-0000-0000-000000000001'),

('30000000-0000-0000-0000-000000000003',
 'Microsoft Intune & Endpoint Management',
 'microsoft-intune-endpoint-management',
 'Understand what MDM controls are on your device, why enrollment matters, and how compliance policies protect corporate data.',
 'Employees often feel uncertain or resistant about enrolling personal or company devices in Intune. This course explains what the organization can and cannot see, why enrollment protects both the employee and the company, and what compliance policies mean in practice.',
 'microsoft_security', 20, 'beginner', 75, 100, FALSE, TRUE, '1.0.0',
 '00000000-0000-0000-0000-000000000001'),

('30000000-0000-0000-0000-000000000004',
 'Conditional Access & Zero Trust Basics',
 'conditional-access-zero-trust',
 'Understand MFA triggers, trusted location policies, risk-based access, and the Zero Trust model in Microsoft 365.',
 'Conditional Access is the enforcement engine of Zero Trust in M365. This course explains why access is sometimes blocked, what risk signals Microsoft evaluates, and how employees can stay productive while remaining compliant with access policies.',
 'microsoft_security', 25, 'intermediate', 80, 125, FALSE, TRUE, '1.0.0',
 '00000000-0000-0000-0000-000000000001'),

-- IT HELPDESK (4 courses)
('40000000-0000-0000-0000-000000000001',
 'Privileged Access Management for IT Staff',
 'privileged-access-management-it',
 'Apply least-privilege principles, separate admin accounts, and use PAM tools to manage elevated access securely.',
 'IT staff with elevated privileges are high-value targets for attackers. This course covers the principles and practices that protect both the individual IT professional and the organization from privileged account compromise.',
 'it_helpdesk', 45, 'advanced', 85, 225, TRUE, TRUE, '1.2.0',
 '00000000-0000-0000-0000-000000000001'),

('40000000-0000-0000-0000-000000000002',
 'Identity Verification & Helpdesk Security',
 'identity-verification-helpdesk',
 'Verify caller identity securely before providing support: callback verification, knowledge-based auth, and vishing defense.',
 'Social engineers frequently call helpdesks pretending to be employees who need urgent assistance. This course gives helpdesk staff the framework to verify identity without being manipulated, while remaining professional and helpful.',
 'it_helpdesk', 30, 'intermediate', 80, 150, TRUE, TRUE, '1.1.0',
 '00000000-0000-0000-0000-000000000001'),

('40000000-0000-0000-0000-000000000003',
 'Secure Remote Support Practices',
 'secure-remote-support-practices',
 'Use remote support tools safely: session authorization, recording, minimal access principles, and post-session cleanup.',
 'Remote support tools like TeamViewer, AnyDesk, and Microsoft Remote Assistance can be abused by both external attackers and malicious insiders. This course teaches IT staff to conduct remote support sessions in a secure, auditable manner.',
 'it_helpdesk', 25, 'intermediate', 80, 125, FALSE, TRUE, '1.0.0',
 '00000000-0000-0000-0000-000000000001'),

('40000000-0000-0000-0000-000000000004',
 'Patch Management & Vulnerability Basics',
 'patch-management-vulnerability-basics',
 'Understand CVE scoring, patch windows, emergency patching procedures, and the IT staff role in vulnerability management.',
 'Unpatched systems are the second leading cause of security breaches. This course equips IT staff with the knowledge to prioritize, schedule, and execute patching operations efficiently while maintaining business continuity.',
 'it_helpdesk', 35, 'advanced', 85, 175, TRUE, TRUE, '1.1.0',
 '00000000-0000-0000-0000-000000000001'),

-- AI THREATS (3 courses)
('50000000-0000-0000-0000-000000000001',
 'AI-Powered Phishing & Deepfake Threats',
 'ai-phishing-deepfake-threats',
 'Recognize AI-generated phishing content, voice-cloning scams, video deepfakes, and CEO fraud in the age of generative AI.',
 'Generative AI has dramatically lowered the barrier for creating highly convincing phishing content, fake audio, and video impersonations. This course prepares employees to remain skeptical even when content appears highly authentic.',
 'ai_threats', 35, 'intermediate', 80, 175, FALSE, TRUE, '1.0.0',
 '00000000-0000-0000-0000-000000000001'),

('50000000-0000-0000-0000-000000000002',
 'MFA Fatigue, Ransomware & Shadow IT',
 'mfa-fatigue-ransomware-shadow-it',
 'Understand MFA fatigue attacks, ransomware kill-chain, and the risks of using unapproved apps and services.',
 'Attackers have adapted to bypass MFA through notification bombing. Meanwhile, ransomware groups now exfiltrate data before encrypting it, and shadow IT creates blind spots in the organization''s security posture. This course addresses all three threats.',
 'ai_threats', 40, 'intermediate', 80, 200, FALSE, TRUE, '1.0.0',
 '00000000-0000-0000-0000-000000000001'),

('50000000-0000-0000-0000-000000000003',
 'Safe AI Tool Usage in the Workplace',
 'safe-ai-tool-usage',
 'Use AI assistants responsibly: approved tool lists, data classification before prompting, and prompt injection awareness.',
 'Employees increasingly use AI tools to boost productivity, but sharing sensitive company or client data with consumer AI services creates serious legal and security risks. This course establishes practical guidelines for safe, policy-compliant AI use.',
 'ai_threats', 30, 'beginner', 75, 150, FALSE, TRUE, '1.0.0',
 '00000000-0000-0000-0000-000000000001');

-- =============================================================================
-- PHISHING TEMPLATES (5 templates)
-- =============================================================================

INSERT INTO phishing_templates (name, category, difficulty, subject, body_html, body_text, sender_name, sender_email, red_flags, is_active) VALUES

('IT Password Reset Alert',
 'credential_harvesting',
 'beginner',
 'URGENT: Your Microsoft 365 password expires in 24 hours',
 '<html><body><p>Dear Employee,</p><p>Your Microsoft 365 password will expire in <strong>24 hours</strong>. Failure to update your password will result in loss of access to all Microsoft services.</p><p><a href="https://m1crosoft-password-reset.net/verify">Click here to reset your password immediately</a></p><p>IT Helpdesk Team<br>CyberShield BPO</p></body></html>',
 'Dear Employee, Your Microsoft 365 password will expire in 24 hours. Failure to update will result in loss of access. Click the link below to reset your password immediately. http://m1crosoft-password-reset.net/verify -- IT Helpdesk Team',
 'IT Helpdesk',
 'noreply@cybershield-itsupport.net',
 '["Urgency and fear tactics (24-hour deadline)", "Misspelled domain: m1crosoft uses numeral 1 instead of letter i", "Sender domain does not match company domain", "Hover over link reveals suspicious external URL", "Generic greeting (Dear Employee) instead of your name"]',
 TRUE),

('HR Annual Bonus Notification',
 'credential_harvesting',
 'beginner',
 'Your Annual Bonus Details Are Ready — Action Required',
 '<html><body><p>Dear Team Member,</p><p>HR is pleased to inform you that your <strong>Annual Performance Bonus</strong> has been processed. To view your bonus amount and complete the direct deposit update form, please log in using the link below.</p><p><a href="https://hr-portal-cybershield.pages.dev/bonus">Access Bonus Portal</a></p><p>Please complete this by COB Friday to avoid delays in payment.</p><p>Warm regards,<br>HR Department</p></body></html>',
 'Dear Team Member, Your Annual Performance Bonus has been processed. To view your bonus amount, please access the HR portal at the link below. Complete by COB Friday to avoid delays. http://hr-portal-cybershield.pages.dev/bonus -- HR Department',
 'HR Department',
 'hr.notifications@cybershield-hr-portal.com',
 '["Sender domain hr-portal-cybershield.pages.dev is hosted on a free hosting platform (pages.dev)", "Financial incentive creates urgency and excitement", "Sender email domain does not match official company domain", "No personalization with employee name or ID", "Friday deadline creates artificial time pressure"]',
 TRUE),

('CEO Wire Transfer Request',
 'bec_fraud',
 'intermediate',
 'Confidential - Urgent Wire Transfer Needed',
 '<html><body><p>Hi,</p><p>I need you to process an urgent wire transfer today. This is for a confidential acquisition we are finalizing and cannot be discussed over normal channels.</p><p>Amount: USD 47,500<br>Beneficiary: Meridian Holdings Corp<br>Account: 8821049302<br>Routing: 021000089</p><p>Please process immediately and confirm by reply. Do not discuss with anyone else until the deal is announced.</p><p>Thanks,<br>Michael Torres<br>Chief Executive Officer</p></body></html>',
 'Hi, I need you to process an urgent wire transfer today for a confidential acquisition. Amount: USD 47,500 to Meridian Holdings Corp. Please process immediately and confirm by reply. Do not discuss with anyone. Thanks, Michael Torres, CEO',
 'Michael Torres (CEO)',
 'mtorres@cybershleld-bpo.com',
 '["Sender email: cybershleld uses letter l instead of i", "Request for secrecy is a major BEC red flag", "Bypasses normal approval channels", "Wire transfers to unfamiliar beneficiaries require dual approval", "CEO rarely sends direct financial instructions without going through Finance", "No official company signature block or phone number for verification"]',
 TRUE),

('IT MFA Verification Required',
 'credential_harvesting',
 'intermediate',
 'Action Required: Verify Your Multi-Factor Authentication Setup',
 '<html><body><p>Dear User,</p><p>Our security system has detected that your MFA configuration needs to be re-verified following a recent system upgrade. Failure to complete verification within 48 hours will result in your account being suspended.</p><p><a href="https://aka-ms-mfa-verify.com/reauthenticate">Complete MFA Verification</a></p><p>If you did not initiate this request, contact IT immediately.</p><p>Microsoft Security Team<br>on behalf of CyberShield IT</p></body></html>',
 'Dear User, Your MFA configuration needs re-verification following a system upgrade. Failure to complete within 48 hours will suspend your account. Complete verification at: https://aka-ms-mfa-verify.com -- Microsoft Security Team',
 'Microsoft Security Team',
 'security@aka-ms-mfa-verify.com',
 '["Domain aka-ms-mfa-verify.com mimics Microsoft aka.ms short links but is completely different", "Threatening account suspension creates fear and urgency", "Microsoft never emails users directly asking them to re-verify MFA this way", "Generic greeting instead of account username", "The link points to a non-Microsoft domain"]',
 TRUE),

('Payslip Download Link',
 'malware_delivery',
 'advanced',
 'Your November Payslip is Ready for Download',
 '<html><body><p>Dear Employee,</p><p>Your payslip for the pay period ending November 30 is now available. Please download it from the secure payroll portal using the link below.</p><p><a href="https://payroll-docs-cybershield.s3-website-ap-southeast.amazonaws.com.payrollaccess.xyz/download">Download Payslip (PDF)</a></p><p>The file is password protected. Your password is the last 4 digits of your employee ID followed by your birth year.</p><p>Payroll Team</p></body></html>',
 'Dear Employee, Your November payslip is ready for download. Use the link below to access the secure payroll portal. The PDF is password protected with last 4 digits of employee ID + birth year. http://payrollaccess.xyz/download -- Payroll Team',
 'Payroll Team',
 'payroll@cybershield-payroll-notifications.com',
 '["The actual domain is payrollaccess.xyz — the AWS subdomain is a spoofing trick", "Asking for predictable password formula reveals data enumeration intent", "Sender domain does not match official company domain", "Legitimate payroll systems use authenticated portals, not email links to downloads", "Password hint that combines employee ID and birth year could be used for identity theft"]',
 TRUE);

-- =============================================================================
-- BADGES (10 badges)
-- =============================================================================

INSERT INTO badges (name, description, icon, category, xp_value, criteria) VALUES
    ('First Steps',
     'Completed your very first training course on CyberShield LMS.',
     'badge-first-steps',
     'completion',
     50,
     '{"type":"course_completion","count":1}'),

    ('Course Champion',
     'Completed 10 training courses.',
     'badge-course-champion',
     'completion',
     200,
     '{"type":"course_completion","count":10}'),

    ('Perfect Score',
     'Achieved 100% on a quiz on the first attempt.',
     'badge-perfect-score',
     'achievement',
     150,
     '{"type":"quiz_perfect","first_attempt":true}'),

    ('Phishing Spotter',
     'Reported a simulated phishing email during a campaign.',
     'badge-phishing-spotter',
     'security',
     100,
     '{"type":"phishing_reported","count":1}'),

    ('Phishing Guardian',
     'Reported 5 simulated phishing emails without clicking any.',
     'badge-phishing-guardian',
     'security',
     300,
     '{"type":"phishing_reported","count":5,"never_clicked":true}'),

    ('7-Day Streak',
     'Logged in and completed training activity for 7 consecutive days.',
     'badge-7day-streak',
     'streak',
     100,
     '{"type":"login_streak","days":7}'),

    ('30-Day Streak',
     'Maintained a 30-day consecutive training streak.',
     'badge-30day-streak',
     'streak',
     400,
     '{"type":"login_streak","days":30}'),

    ('Compliance All-Star',
     'Completed all required courses with a passing score.',
     'badge-compliance-allstar',
     'completion',
     350,
     '{"type":"required_courses_all_passed"}'),

    ('Security Advocate',
     'Achieved a security score of 90 or above.',
     'badge-security-advocate',
     'security',
     250,
     '{"type":"security_score","min":90}'),

    ('Early Adopter',
     'One of the first 50 users to complete onboarding on the platform.',
     'badge-early-adopter',
     'special',
     75,
     '{"type":"onboarding_rank","max":50}');

-- =============================================================================
-- TRAINING ASSIGNMENTS
-- Mix of completed, pending, in-progress, and overdue
-- =============================================================================

-- Required courses assigned to ALL employees (via department)
INSERT INTO training_assignments (user_id, department_id, course_id, assigned_by, due_date, is_required, status, assigned_at) VALUES
    -- Department-wide: assign Password Security to Operations
    (NULL,
     (SELECT id FROM departments WHERE code = 'OPS'),
     '10000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000001',
     CURRENT_DATE + INTERVAL '30 days',
     TRUE,
     'pending',
     NOW() - INTERVAL '5 days'),

    -- Department-wide: PII Handling to Finance (overdue)
    (NULL,
     (SELECT id FROM departments WHERE code = 'FIN'),
     '20000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000001',
     CURRENT_DATE - INTERVAL '7 days',
     TRUE,
     'overdue',
     NOW() - INTERVAL '37 days');

-- Individual assignments
INSERT INTO training_assignments (user_id, department_id, course_id, assigned_by, due_date, is_required, status, assigned_at, completed_at) VALUES
    -- Grace Villanueva — completed Phishing Defense
    ('00000000-0000-0000-0000-000000000006',
     NULL,
     '10000000-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000002',
     CURRENT_DATE + INTERVAL '14 days',
     TRUE,
     'completed',
     NOW() - INTERVAL '20 days',
     NOW() - INTERVAL '15 days'),

    -- Rodel Campos — overdue Phishing Defense
    ('00000000-0000-0000-0000-000000000007',
     NULL,
     '10000000-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000002',
     CURRENT_DATE - INTERVAL '5 days',
     TRUE,
     'overdue',
     NOW() - INTERVAL '35 days',
     NULL),

    -- Paul Aquino — in progress on Remote Work Security
    ('00000000-0000-0000-0000-000000000009',
     NULL,
     '10000000-0000-0000-0000-000000000004',
     '00000000-0000-0000-0000-000000000001',
     CURRENT_DATE + INTERVAL '7 days',
     TRUE,
     'in_progress',
     NOW() - INTERVAL '10 days',
     NULL),

    -- Mark Garcia — overdue PCI-DSS (Finance)
    ('00000000-0000-0000-0000-000000000011',
     NULL,
     '20000000-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000001',
     CURRENT_DATE - INTERVAL '14 days',
     TRUE,
     'overdue',
     NOW() - INTERVAL '44 days',
     NULL),

    -- Ben Flores — pending PCI-DSS (Finance)
    ('00000000-0000-0000-0000-000000000015',
     NULL,
     '20000000-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000001',
     CURRENT_DATE + INTERVAL '21 days',
     TRUE,
     'pending',
     NOW() - INTERVAL '2 days',
     NULL),

    -- Carlo Mendoza (IT Staff) — PAM course
    ('00000000-0000-0000-0000-000000000005',
     NULL,
     '40000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000003',
     CURRENT_DATE + INTERVAL '14 days',
     TRUE,
     'in_progress',
     NOW() - INTERVAL '7 days',
     NULL),

    -- Diana Ong (IT) — Identity Verification completed
    ('00000000-0000-0000-0000-000000000014',
     NULL,
     '40000000-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000003',
     CURRENT_DATE + INTERVAL '30 days',
     TRUE,
     'completed',
     NOW() - INTERVAL '30 days',
     NOW() - INTERVAL '22 days'),

    -- Rose Bautista (Compliance) — Client Compliance completed
    ('00000000-0000-0000-0000-000000000012',
     NULL,
     '20000000-0000-0000-0000-000000000004',
     '00000000-0000-0000-0000-000000000004',
     CURRENT_DATE + INTERVAL '30 days',
     TRUE,
     'completed',
     NOW() - INTERVAL '40 days',
     NOW() - INTERVAL '35 days'),

    -- Kevin Lim — AI Threats pending
    ('00000000-0000-0000-0000-000000000013',
     NULL,
     '50000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000001',
     CURRENT_DATE + INTERVAL '60 days',
     FALSE,
     'pending',
     NOW() - INTERVAL '1 day',
     NULL);

-- =============================================================================
-- USER PROGRESS (matching completed assignments)
-- =============================================================================

INSERT INTO user_progress (user_id, course_id, status, progress_percentage, started_at, completed_at, time_spent_seconds) VALUES
    -- Grace — Phishing Defense completed
    ('00000000-0000-0000-0000-000000000006',
     '10000000-0000-0000-0000-000000000002',
     'completed', 100,
     NOW() - INTERVAL '18 days',
     NOW() - INTERVAL '15 days',
     2280),

    -- Rodel — Phishing Defense in progress (38%)
    ('00000000-0000-0000-0000-000000000007',
     '10000000-0000-0000-0000-000000000002',
     'in_progress', 38,
     NOW() - INTERVAL '25 days',
     NULL,
     840),

    -- Paul — Remote Work in progress (55%)
    ('00000000-0000-0000-0000-000000000009',
     '10000000-0000-0000-0000-000000000004',
     'in_progress', 55,
     NOW() - INTERVAL '9 days',
     NULL,
     990),

    -- Diana — Identity Verification completed
    ('00000000-0000-0000-0000-000000000014',
     '40000000-0000-0000-0000-000000000002',
     'completed', 100,
     NOW() - INTERVAL '28 days',
     NOW() - INTERVAL '22 days',
     1860),

    -- Rose — Client Compliance completed
    ('00000000-0000-0000-0000-000000000012',
     '20000000-0000-0000-0000-000000000004',
     'completed', 100,
     NOW() - INTERVAL '38 days',
     NOW() - INTERVAL '35 days',
     2100),

    -- Carlo — PAM in progress (70%)
    ('00000000-0000-0000-0000-000000000005',
     '40000000-0000-0000-0000-000000000001',
     'in_progress', 70,
     NOW() - INTERVAL '6 days',
     NULL,
     1980),

    -- Nina — Password Security completed
    ('00000000-0000-0000-0000-000000000010',
     '10000000-0000-0000-0000-000000000001',
     'completed', 100,
     NOW() - INTERVAL '45 days',
     NOW() - INTERVAL '42 days',
     1740);

-- =============================================================================
-- PHISHING CAMPAIGN + TARGETS
-- =============================================================================

INSERT INTO phishing_campaigns (id, name, description, type, status, target_type, template_id, launched_by, launched_at, completed_at) VALUES
    ('c0000000-0000-0000-0000-000000000001',
     'Q4 2024 IT Password Reset Campaign',
     'Quarterly phishing simulation targeting all staff using the IT password reset lure',
     'email',
     'completed',
     'all',
     (SELECT id FROM phishing_templates WHERE name = 'IT Password Reset Alert'),
     '00000000-0000-0000-0000-000000000001',
     NOW() - INTERVAL '60 days',
     NOW() - INTERVAL '53 days'),

    ('c0000000-0000-0000-0000-000000000002',
     'Finance Department BEC Test',
     'Targeted BEC simulation for Finance team using CEO wire transfer lure',
     'email',
     'completed',
     'department',
     (SELECT id FROM phishing_templates WHERE name = 'CEO Wire Transfer Request'),
     '00000000-0000-0000-0000-000000000001',
     NOW() - INTERVAL '30 days',
     NOW() - INTERVAL '23 days');

-- Targets for Campaign 1 (all staff sample)
INSERT INTO phishing_targets (campaign_id, user_id, email_sent_at, clicked_at, reported_at, click_token, report_token) VALUES
    ('c0000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000006',
     NOW() - INTERVAL '60 days', NULL,
     NOW() - INTERVAL '59 days',
     'tok_click_grace_q4', 'tok_report_grace_q4'),

    ('c0000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000007',
     NOW() - INTERVAL '60 days',
     NOW() - INTERVAL '59 days 22 hours',
     NULL,
     'tok_click_rodel_q4', 'tok_report_rodel_q4'),

    ('c0000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000009',
     NOW() - INTERVAL '60 days',
     NOW() - INTERVAL '59 days 20 hours',
     NULL,
     'tok_click_paul_q4', 'tok_report_paul_q4'),

    ('c0000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000010',
     NOW() - INTERVAL '60 days', NULL, NULL,
     'tok_click_nina_q4', 'tok_report_nina_q4'),

    ('c0000000-0000-0000-0000-000000000001',
     '00000000-0000-0000-0000-000000000012',
     NOW() - INTERVAL '60 days', NULL,
     NOW() - INTERVAL '59 days 18 hours',
     'tok_click_rose_q4', 'tok_report_rose_q4');

-- Targets for Campaign 2 (Finance BEC)
INSERT INTO phishing_targets (campaign_id, user_id, email_sent_at, clicked_at, reported_at, click_token, report_token) VALUES
    ('c0000000-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000010',
     NOW() - INTERVAL '30 days', NULL,
     NOW() - INTERVAL '29 days 21 hours',
     'tok_click_nina_bec', 'tok_report_nina_bec'),

    ('c0000000-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000011',
     NOW() - INTERVAL '30 days',
     NOW() - INTERVAL '29 days 23 hours',
     NULL,
     'tok_click_mark_bec', 'tok_report_mark_bec'),

    ('c0000000-0000-0000-0000-000000000002',
     '00000000-0000-0000-0000-000000000015',
     NOW() - INTERVAL '30 days',
     NOW() - INTERVAL '29 days 20 hours',
     NULL,
     'tok_click_ben_bec', 'tok_report_ben_bec');

-- =============================================================================
-- USER BADGES (earned badges for high performers)
-- =============================================================================

INSERT INTO user_badges (user_id, badge_id, earned_at) VALUES
    -- Rose Bautista: First Steps + Phishing Guardian + Compliance All-Star
    ('00000000-0000-0000-0000-000000000012',
     (SELECT id FROM badges WHERE name = 'First Steps'),
     NOW() - INTERVAL '38 days'),
    ('00000000-0000-0000-0000-000000000012',
     (SELECT id FROM badges WHERE name = 'Phishing Spotter'),
     NOW() - INTERVAL '59 days 18 hours'),

    -- Grace Villanueva: First Steps + Phishing Spotter
    ('00000000-0000-0000-0000-000000000006',
     (SELECT id FROM badges WHERE name = 'First Steps'),
     NOW() - INTERVAL '15 days'),
    ('00000000-0000-0000-0000-000000000006',
     (SELECT id FROM badges WHERE name = 'Phishing Spotter'),
     NOW() - INTERVAL '59 days'),

    -- Nina Castillo: First Steps + Security Advocate
    ('00000000-0000-0000-0000-000000000010',
     (SELECT id FROM badges WHERE name = 'First Steps'),
     NOW() - INTERVAL '42 days'),
    ('00000000-0000-0000-0000-000000000010',
     (SELECT id FROM badges WHERE name = 'Phishing Spotter'),
     NOW() - INTERVAL '29 days 21 hours'),

    -- Diana Ong: First Steps
    ('00000000-0000-0000-0000-000000000014',
     (SELECT id FROM badges WHERE name = 'First Steps'),
     NOW() - INTERVAL '22 days'),

    -- Admin: Early Adopter
    ('00000000-0000-0000-0000-000000000001',
     (SELECT id FROM badges WHERE name = 'Early Adopter'),
     NOW() - INTERVAL '90 days');

-- =============================================================================
-- SECURITY SCORES (historical snapshots)
-- =============================================================================

INSERT INTO security_scores (user_id, score, factors, calculated_at) VALUES
    ('00000000-0000-0000-0000-000000000006', 72,
     '{"course_completion":30,"quiz_scores":20,"phishing_reports":12,"streak":5,"badges":5}',
     NOW() - INTERVAL '1 day'),
    ('00000000-0000-0000-0000-000000000010', 82,
     '{"course_completion":35,"quiz_scores":22,"phishing_reports":15,"streak":7,"badges":3}',
     NOW() - INTERVAL '1 day'),
    ('00000000-0000-0000-0000-000000000012', 91,
     '{"course_completion":40,"quiz_scores":25,"phishing_reports":15,"streak":8,"badges":3}',
     NOW() - INTERVAL '1 day'),
    ('00000000-0000-0000-0000-000000000011', 48,
     '{"course_completion":10,"quiz_scores":15,"phishing_reports":0,"streak":2,"badges":0}',
     NOW() - INTERVAL '1 day'),
    ('00000000-0000-0000-0000-000000000015', 40,
     '{"course_completion":5,"quiz_scores":10,"phishing_reports":0,"streak":0,"badges":0}',
     NOW() - INTERVAL '1 day');

-- =============================================================================
-- NOTIFICATIONS (sample)
-- =============================================================================

INSERT INTO notifications (user_id, type, title, message, data, is_read) VALUES
    ('00000000-0000-0000-0000-000000000007',
     'course_due',
     'Course Overdue: Phishing & Social Engineering Defense',
     'Your assignment "Phishing & Social Engineering Defense" was due 5 days ago. Please complete it as soon as possible to maintain compliance.',
     '{"course_id":"10000000-0000-0000-0000-000000000002","days_overdue":5}',
     FALSE),

    ('00000000-0000-0000-0000-000000000011',
     'course_due',
     'Course Overdue: PCI-DSS Awareness for Agents',
     'Your PCI-DSS training is now 14 days overdue. This is a required compliance course. Please contact your manager immediately.',
     '{"course_id":"20000000-0000-0000-0000-000000000002","days_overdue":14}',
     FALSE),

    ('00000000-0000-0000-0000-000000000006',
     'badge_earned',
     'Badge Earned: Phishing Spotter',
     'Congratulations! You reported a simulated phishing email and earned the Phishing Spotter badge.',
     '{"badge_id":4,"badge_name":"Phishing Spotter"}',
     TRUE),

    ('00000000-0000-0000-0000-000000000012',
     'badge_earned',
     'Badge Earned: First Steps',
     'You have completed your first course on CyberShield LMS. Welcome aboard!',
     '{"badge_id":1,"badge_name":"First Steps"}',
     TRUE),

    ('00000000-0000-0000-0000-000000000007',
     'phishing_caught',
     'Simulated Phishing: You Clicked the Link',
     'During our Q4 simulation, you clicked a phishing link. This was a training exercise. Please review the Phishing Defense course to sharpen your skills.',
     '{"campaign_id":"c0000000-0000-0000-0000-000000000001","template":"IT Password Reset Alert"}',
     FALSE);
