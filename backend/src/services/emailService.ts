import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import { config } from '../config';
import { logger } from '../utils/logger';
import { User, Course, Certificate } from '../types';

// ─── Transporter Setup ────────────────────────────────────────────────────────

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    if (config.smtp.user && config.smtp.pass) {
      transporter = nodemailer.createTransport({
        host: config.smtp.host,
        port: config.smtp.port,
        secure: config.smtp.port === 465,
        auth: {
          user: config.smtp.user,
          pass: config.smtp.pass,
        },
        tls: {
          rejectUnauthorized: config.isProduction,
        },
      });
    } else {
      // Development: use Ethereal / preview emails
      logger.warn('SMTP credentials not configured — emails will be logged only');
      transporter = nodemailer.createTransport({
        jsonTransport: true,
      });
    }
  }
  return transporter;
}

// ─── Base Send ────────────────────────────────────────────────────────────────

async function sendMail(options: SendMailOptions): Promise<void> {
  try {
    const t = getTransporter();
    const info = await t.sendMail({
      from: `"${config.smtp.fromName}" <${config.smtp.fromEmail}>`,
      ...options,
    });

    if (config.isDevelopment) {
      logger.debug('Email sent (dev)', {
        to: options.to,
        subject: options.subject,
        messageId: (info as { messageId?: string }).messageId,
      });
    }
  } catch (err) {
    logger.error('Email send failed', {
      to: options.to,
      subject: options.subject,
      error: (err as Error).message,
    });
    // Do not throw — email failures should never crash the API
  }
}

// ─── HTML Helpers ─────────────────────────────────────────────────────────────

function emailWrapper(content: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberShield LMS</title>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #1a1f3e 0%, #0ea5e9 100%); color: white; padding: 24px 32px; }
    .header h1 { margin: 0; font-size: 20px; }
    .body { padding: 32px; color: #333333; line-height: 1.6; }
    .button { display: inline-block; background: #0ea5e9; color: white !important; padding: 12px 28px; border-radius: 6px; text-decoration: none; font-weight: bold; margin: 16px 0; }
    .footer { background: #f8f9fa; padding: 20px 32px; font-size: 12px; color: #666666; text-align: center; border-top: 1px solid #e9ecef; }
    .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px 16px; border-radius: 4px; margin: 16px 0; }
    .success { background: #d4edda; border-left: 4px solid #28a745; padding: 12px 16px; border-radius: 4px; margin: 16px 0; }
    .info { background: #cce5ff; border-left: 4px solid #004085; padding: 12px 16px; border-radius: 4px; margin: 16px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🛡️ CyberShield LMS</h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>CyberShield LMS — Cybersecurity Training Platform</p>
      <p>This email was sent automatically. Please do not reply directly to this message.</p>
      <p><a href="${config.frontend.url}/unsubscribe">Unsubscribe from non-critical notifications</a></p>
    </div>
  </div>
</body>
</html>`;
}

// ─── Welcome Email ────────────────────────────────────────────────────────────

export async function sendWelcomeEmail(user: User): Promise<void> {
  const html = emailWrapper(`
    <h2>Welcome to CyberShield LMS, ${user.firstName}!</h2>
    <p>Your account has been created. CyberShield helps keep our organisation secure by ensuring everyone is trained on the latest cybersecurity threats and best practices.</p>
    <div class="success">
      <strong>Your account details:</strong><br>
      Email: ${user.email}<br>
      Role: ${user.role}<br>
      Department: ${user.department}
    </div>
    <p>Get started by completing your required training courses:</p>
    <a href="${config.frontend.url}/dashboard" class="button">Go to Dashboard</a>
    <p>If you have any questions, contact your IT Security team.</p>
  `);

  await sendMail({
    to: user.email,
    subject: 'Welcome to CyberShield LMS — Get Started with Your Security Training',
    html,
    text: `Welcome to CyberShield LMS, ${user.firstName}! Visit ${config.frontend.url}/dashboard to get started.`,
  });

  logger.info('Welcome email sent', { userId: user.id, email: user.email });
}

// ─── Course Assignment Email ──────────────────────────────────────────────────

export async function sendCourseAssignmentEmail(
  user: User,
  course: Course,
  dueDate?: Date | null
): Promise<void> {
  const dueDateStr = dueDate
    ? `<div class="alert"><strong>Due date:</strong> ${dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</div>`
    : '';

  const html = emailWrapper(`
    <h2>New Training Course Assigned, ${user.firstName}!</h2>
    <p>You have been assigned a new security training course that requires your attention.</p>
    <div class="info">
      <strong>${course.title}</strong><br>
      Category: ${course.category.replace(/_/g, ' ')}<br>
      Difficulty: ${course.difficulty}<br>
      Estimated time: ${course.estimatedMinutes} minutes
    </div>
    ${dueDateStr}
    <p>${course.description}</p>
    <a href="${config.frontend.url}/courses/${course.id}" class="button">Start Course Now</a>
    <p>Completing your training on time is important for maintaining our organisation's security posture and compliance requirements.</p>
  `);

  await sendMail({
    to: user.email,
    subject: `New Training Required: ${course.title}`,
    html,
    text: `Hi ${user.firstName}, you have been assigned "${course.title}". Visit ${config.frontend.url}/courses/${course.id} to start.`,
  });

  logger.info('Course assignment email sent', { userId: user.id, courseId: course.id });
}

// ─── Completion Certificate Email ─────────────────────────────────────────────

export async function sendCompletionCertificate(
  user: User,
  course: Course,
  certificate: Certificate
): Promise<void> {
  const expiryStr = certificate.expiresAt
    ? `<p>Your certificate is valid until ${certificate.expiresAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}.</p>`
    : '';

  const html = emailWrapper(`
    <h2>Congratulations, ${user.firstName}! 🎉</h2>
    <p>You have successfully completed <strong>${course.title}</strong>.</p>
    <div class="success">
      <strong>Certificate Details:</strong><br>
      Certificate Number: ${certificate.certificateNumber}<br>
      Issued: ${certificate.issuedAt.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
    </div>
    ${expiryStr}
    <p>You can download your certificate from your profile at any time.</p>
    <a href="${config.frontend.url}/profile/certificates" class="button">View My Certificates</a>
    <p>Keep up the great work in strengthening our organisation's cybersecurity posture!</p>
  `);

  await sendMail({
    to: user.email,
    subject: `Certificate Earned: ${course.title}`,
    html,
    text: `Congratulations ${user.firstName}! You have completed "${course.title}". Certificate: ${certificate.certificateNumber}`,
  });

  logger.info('Certificate email sent', { userId: user.id, certId: certificate.id });
}

// ─── Phishing Awareness Email ─────────────────────────────────────────────────

export async function sendPhishingAwarenessEmail(user: User): Promise<void> {
  const html = emailWrapper(`
    <h2>Important Security Training Notice, ${user.firstName}</h2>
    <div class="alert">
      <strong>You recently clicked a link in a simulated phishing email.</strong>
    </div>
    <p>This was a <strong>security awareness test</strong> conducted by your IT Security team. No harm was done, but this is a great learning opportunity.</p>
    <h3>What to look for in phishing emails:</h3>
    <ul>
      <li><strong>Urgency:</strong> Pressure to act immediately without thinking</li>
      <li><strong>Suspicious sender:</strong> Email domain doesn't match the company it claims to be from</li>
      <li><strong>Generic greetings:</strong> "Dear User" instead of your name</li>
      <li><strong>Suspicious links:</strong> Hover to check URLs before clicking</li>
      <li><strong>Unexpected attachments:</strong> Were you expecting this file?</li>
      <li><strong>Requests for credentials:</strong> Legitimate services rarely ask you to log in via email</li>
    </ul>
    <p>We recommend completing our Phishing Awareness course to sharpen your skills:</p>
    <a href="${config.frontend.url}/courses/crs-001" class="button">Take Phishing Awareness Course</a>
    <p>Remember: when in doubt, report suspicious emails to your IT Security team before clicking.</p>
  `);

  await sendMail({
    to: user.email,
    subject: 'Security Alert: You Clicked a Simulated Phishing Link — Training Resource Inside',
    html,
    text: `Hi ${user.firstName}, you clicked a simulated phishing link. Visit ${config.frontend.url}/courses/crs-001 to complete awareness training.`,
  });

  logger.info('Phishing awareness email sent', { userId: user.id });
}

// ─── Compliance Reminder ──────────────────────────────────────────────────────

export async function sendComplianceReminderEmail(
  users: User[],
  deadline: Date
): Promise<void> {
  const deadlineStr = deadline.toLocaleDateString('en-GB', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

  await Promise.allSettled(
    users.map(user => {
      const html = emailWrapper(`
        <h2>Training Deadline Reminder, ${user.firstName}</h2>
        <div class="alert">
          <strong>You have incomplete required training due by ${deadlineStr}.</strong>
        </div>
        <p>Please log in to CyberShield LMS to review and complete your outstanding training assignments before the deadline.</p>
        <a href="${config.frontend.url}/dashboard" class="button">Complete My Training</a>
        <p>Failure to complete required training may affect your access to certain systems and will be reported to your manager.</p>
      `);

      return sendMail({
        to: user.email,
        subject: `Action Required: Training Due ${deadlineStr}`,
        html,
        text: `Hi ${user.firstName}, you have training due by ${deadlineStr}. Visit ${config.frontend.url}/dashboard to complete it.`,
      });
    })
  );

  logger.info('Compliance reminder batch sent', { count: users.length, deadline: deadlineStr });
}

// ─── Password Reset Email ─────────────────────────────────────────────────────

export async function sendPasswordResetEmail(user: User, token: string): Promise<void> {
  const resetUrl = `${config.frontend.url}/reset-password?token=${token}`;

  const html = emailWrapper(`
    <h2>Password Reset Request</h2>
    <p>Hi ${user.firstName},</p>
    <p>We received a request to reset your CyberShield LMS password. Click the button below to create a new password:</p>
    <a href="${resetUrl}" class="button">Reset My Password</a>
    <div class="alert">
      <strong>This link expires in 1 hour.</strong><br>
      If you did not request this, please ignore this email — your password will not change.
    </div>
    <p>If the button doesn't work, copy and paste this URL into your browser:<br>
    <small><a href="${resetUrl}">${resetUrl}</a></small></p>
  `);

  await sendMail({
    to: user.email,
    subject: 'CyberShield LMS — Password Reset Request',
    html,
    text: `Hi ${user.firstName}, reset your password at: ${resetUrl} (expires in 1 hour)`,
  });

  logger.info('Password reset email sent', { userId: user.id });
}

// ─── Weekly Digest ────────────────────────────────────────────────────────────

export interface WeeklyDigestData {
  period: string;
  totalCompletions: number;
  complianceRate: number;
  overdueCount: number;
  topPerformers: Array<{ name: string; completions: number }>;
  needsAttention: Array<{ name: string; overdueCount: number }>;
}

export async function sendWeeklyDigest(
  manager: User,
  report: WeeklyDigestData
): Promise<void> {
  const performers = report.topPerformers
    .map(p => `<li><strong>${p.name}</strong> — ${p.completions} completion(s)</li>`)
    .join('');

  const attention = report.needsAttention
    .map(p => `<li><strong>${p.name}</strong> — ${p.overdueCount} overdue</li>`)
    .join('');

  const html = emailWrapper(`
    <h2>Weekly Training Digest — ${report.period}</h2>
    <p>Hi ${manager.firstName}, here is your team's training summary for this week.</p>
    <div class="info">
      <strong>Key Metrics</strong><br>
      Completions this week: ${report.totalCompletions}<br>
      Overall compliance rate: ${report.complianceRate}%<br>
      Overdue assignments: ${report.overdueCount}
    </div>
    ${performers.length ? `<h3>Top Performers</h3><ul>${performers}</ul>` : ''}
    ${attention.length ? `<h3>Needs Attention</h3><ul>${attention}</ul>` : ''}
    <a href="${config.frontend.url}/reports" class="button">View Full Report</a>
  `);

  await sendMail({
    to: manager.email,
    subject: `CyberShield LMS — Weekly Digest for ${report.period}`,
    html,
    text: `Hi ${manager.firstName}, your team's compliance rate is ${report.complianceRate}%. View full report at ${config.frontend.url}/reports`,
  });

  logger.info('Weekly digest sent', { managerId: manager.id, period: report.period });
}
