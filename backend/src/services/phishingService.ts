import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database';
import { logger } from '../utils/logger';
import { sendPhishingAwarenessEmail } from './emailService';
import {
  PhishingCampaign, PhishingEvent, PhishingCampaignResult,
  PhishingStats, DepartmentPhishingStats, User,
} from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateCampaignInput {
  name: string;
  description: string;
  templateId: string;
  targetDepartments?: string[];
  targetUserIds?: string[];
  scheduledAt: Date;
  landingPageUrl: string;
  createdBy: string;
}

// ─── Mock data for dev / no-DB fallback ──────────────────────────────────────

const mockCampaigns: PhishingCampaign[] = [
  {
    id: 'camp-001',
    name: 'Q1 Phishing Simulation',
    description: 'Quarterly mandatory phishing simulation for all staff.',
    status: 'completed',
    templateId: 'tmpl-001',
    targetDepartments: ['Engineering', 'Marketing', 'Finance'],
    targetUserIds: [],
    scheduledAt: new Date('2024-01-15T09:00:00Z'),
    completedAt: new Date('2024-01-22T17:00:00Z'),
    createdBy: 'usr-001',
    createdAt: new Date('2024-01-10'),
    landingPageUrl: 'https://cybershield.local/phishing/awareness',
    totalTargets: 120,
    clickCount: 18,
    reportCount: 24,
    clickRate: 15,
    reportRate: 20,
  },
  {
    id: 'camp-002',
    name: 'Credential Harvesting Test',
    description: 'Tests susceptibility to credential harvesting via fake login pages.',
    status: 'active',
    templateId: 'tmpl-002',
    targetDepartments: [],
    targetUserIds: [],
    scheduledAt: new Date('2024-04-01T09:00:00Z'),
    completedAt: null,
    createdBy: 'usr-001',
    createdAt: new Date('2024-03-25'),
    landingPageUrl: 'https://cybershield.local/phishing/awareness',
    totalTargets: 150,
    clickCount: 12,
    reportCount: 35,
    clickRate: 8,
    reportRate: 23,
  },
];

// ─── Create Campaign ──────────────────────────────────────────────────────────

export async function createCampaign(input: CreateCampaignInput): Promise<PhishingCampaign> {
  const id = uuidv4();

  try {
    const rows = await query<PhishingCampaign>(
      `INSERT INTO phishing_campaigns
         (id, name, description, template_id, target_departments, target_user_ids,
          scheduled_at, landing_page_url, created_by, status, total_targets,
          click_count, report_count, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft', 0, 0, 0, NOW())
       RETURNING
         id, name, description, status, template_id AS "templateId",
         target_departments AS "targetDepartments", target_user_ids AS "targetUserIds",
         scheduled_at AS "scheduledAt", completed_at AS "completedAt",
         created_by AS "createdBy", created_at AS "createdAt",
         landing_page_url AS "landingPageUrl",
         total_targets AS "totalTargets", click_count AS "clickCount",
         report_count AS "reportCount"`,
      [
        id, input.name, input.description, input.templateId,
        input.targetDepartments ?? [], input.targetUserIds ?? [],
        input.scheduledAt, input.landingPageUrl, input.createdBy,
      ]
    );

    const campaign = rows[0];
    if (!campaign) throw new Error('Insert returned no rows');
    logger.info('Phishing campaign created', { campaignId: id, name: input.name });
    return campaign;
  } catch (err) {
    logger.error('Failed to create phishing campaign in DB — using mock', { error: (err as Error).message });
    // Return a local mock
    const mock: PhishingCampaign = {
      id,
      name: input.name,
      description: input.description,
      status: 'draft',
      templateId: input.templateId,
      targetDepartments: input.targetDepartments ?? [],
      targetUserIds: input.targetUserIds ?? [],
      scheduledAt: input.scheduledAt,
      completedAt: null,
      createdBy: input.createdBy,
      createdAt: new Date(),
      landingPageUrl: input.landingPageUrl,
      totalTargets: 0,
      clickCount: 0,
      reportCount: 0,
    };
    mockCampaigns.push(mock);
    return mock;
  }
}

// ─── Send Phishing Emails ─────────────────────────────────────────────────────

export async function sendPhishingEmails(
  campaignId: string,
  targetUsers: User[]
): Promise<{ sent: number; failed: number }> {
  let sent = 0;
  let failed = 0;

  for (const user of targetUsers) {
    const token = uuidv4();

    try {
      await query(
        `INSERT INTO phishing_events
           (id, campaign_id, user_id, token, sent_at)
         VALUES ($1, $2, $3, $4, NOW())`,
        [uuidv4(), campaignId, user.id, token]
      );
    } catch {
      // DB unavailable — log only
    }

    // In a real system you'd call nodemailer here with a personalised phishing email.
    // We log the send instead so we don't accidentally send real phishing emails.
    logger.info('Phishing email scheduled', {
      campaignId,
      userId: user.id,
      email: user.email,
      token,
    });

    sent++;
  }

  try {
    await query(
      'UPDATE phishing_campaigns SET total_targets = $1, status = $2 WHERE id = $3',
      [sent, 'active', campaignId]
    );
  } catch { /* non-critical */ }

  return { sent, failed };
}

// ─── Record Click ─────────────────────────────────────────────────────────────

export async function recordClick(
  token: string,
  ipAddress: string | null,
  userAgent: string | null
): Promise<{ userId: string; campaignId: string } | null> {
  try {
    const event = await queryOne<{ id: string; userId: string; campaignId: string; clickedAt: Date | null }>(
      `SELECT id, user_id AS "userId", campaign_id AS "campaignId", clicked_at AS "clickedAt"
       FROM phishing_events WHERE token = $1`,
      [token]
    );

    if (!event) return null;

    // Only record the first click
    if (!event.clickedAt) {
      await query(
        `UPDATE phishing_events
         SET clicked_at = NOW(), ip_address = $1, user_agent = $2
         WHERE token = $3`,
        [ipAddress, userAgent, token]
      );

      await query(
        'UPDATE phishing_campaigns SET click_count = click_count + 1 WHERE id = $1',
        [event.campaignId]
      );

      // Fetch and update risk score
      const user = await queryOne<User>(
        `SELECT id, email, first_name AS "firstName", last_name AS "lastName", role, department,
                job_title AS "jobTitle", manager_id AS "managerId", avatar_url AS "avatarUrl",
                is_active AS "isActive", last_login AS "lastLogin", created_at AS "createdAt",
                updated_at AS "updatedAt", microsoft_id AS "microsoftId",
                phone_number AS "phoneNumber", risk_score AS "riskScore"
         FROM users WHERE id = $1`,
        [event.userId]
      );

      if (user) {
        // Increase risk score on click (max 100)
        const newRiskScore = Math.min(100, user.riskScore + 15);
        await query('UPDATE users SET risk_score = $1 WHERE id = $2', [newRiskScore, user.id]);

        // Send awareness follow-up
        setImmediate(() => sendPhishingAwarenessEmail(user).catch(() => null));
      }

      logger.warn('Phishing link clicked', { token, userId: event.userId, campaignId: event.campaignId });
    }

    return { userId: event.userId, campaignId: event.campaignId };
  } catch (err) {
    logger.error('Failed to record phishing click', { token, error: (err as Error).message });
    return null;
  }
}

// ─── Record Report ────────────────────────────────────────────────────────────

export async function recordReport(
  token: string
): Promise<{ userId: string; campaignId: string } | null> {
  try {
    const event = await queryOne<{ id: string; userId: string; campaignId: string; reportedAt: Date | null }>(
      `SELECT id, user_id AS "userId", campaign_id AS "campaignId", reported_at AS "reportedAt"
       FROM phishing_events WHERE token = $1`,
      [token]
    );

    if (!event) return null;

    if (!event.reportedAt) {
      await query(
        'UPDATE phishing_events SET reported_at = NOW() WHERE token = $1',
        [token]
      );

      await query(
        'UPDATE phishing_campaigns SET report_count = report_count + 1 WHERE id = $1',
        [event.campaignId]
      );

      // Decrease risk score when user reports (good behaviour)
      await query(
        'UPDATE users SET risk_score = GREATEST(0, risk_score - 5) WHERE id = $1',
        [event.userId]
      );

      logger.info('Phishing email reported by user', {
        token, userId: event.userId, campaignId: event.campaignId,
      });
    }

    return { userId: event.userId, campaignId: event.campaignId };
  } catch (err) {
    logger.error('Failed to record phishing report', { token, error: (err as Error).message });
    return null;
  }
}

// ─── Generate Report ──────────────────────────────────────────────────────────

export async function generateReport(campaignId: string): Promise<PhishingCampaignResult | null> {
  try {
    let campaign: PhishingCampaign | null = null;
    let events: PhishingEvent[] = [];

    try {
      campaign = await queryOne<PhishingCampaign>(
        `SELECT
           id, name, description, status, template_id AS "templateId",
           target_departments AS "targetDepartments", target_user_ids AS "targetUserIds",
           scheduled_at AS "scheduledAt", completed_at AS "completedAt",
           created_by AS "createdBy", created_at AS "createdAt",
           landing_page_url AS "landingPageUrl",
           total_targets AS "totalTargets", click_count AS "clickCount",
           report_count AS "reportCount"
         FROM phishing_campaigns WHERE id = $1`,
        [campaignId]
      );

      if (campaign) {
        events = await query<PhishingEvent>(
          `SELECT
             id, campaign_id AS "campaignId", user_id AS "userId", token,
             sent_at AS "sentAt", opened_at AS "openedAt", clicked_at AS "clickedAt",
             reported_at AS "reportedAt", ip_address AS "ipAddress", user_agent AS "userAgent"
           FROM phishing_events WHERE campaign_id = $1`,
          [campaignId]
        );
      }
    } catch {
      campaign = mockCampaigns.find(c => c.id === campaignId) ?? null;
      events = [];
    }

    if (!campaign) return null;

    const totalSent = events.length || campaign.totalTargets;
    const totalOpened = events.filter(e => e.openedAt).length;
    const totalClicked = campaign.clickCount;
    const totalReported = campaign.reportCount;

    // Aggregate by department from events
    const deptMap: Map<string, DepartmentPhishingStats> = new Map();
    for (const event of events) {
      // We'd need a JOIN for the real query — simplified here
      const dept = 'Unknown';
      if (!deptMap.has(dept)) {
        deptMap.set(dept, { department: dept, sent: 0, clicked: 0, reported: 0, clickRate: 0 });
      }
      const d = deptMap.get(dept)!;
      d.sent++;
      if (event.clickedAt) d.clicked++;
      if (event.reportedAt) d.reported++;
      d.clickRate = d.sent > 0 ? Math.round((d.clicked / d.sent) * 100) : 0;
    }

    const stats: PhishingStats = {
      totalSent,
      totalOpened,
      totalClicked,
      totalReported,
      openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
      clickRate: totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0,
      reportRate: totalSent > 0 ? Math.round((totalReported / totalSent) * 100) : 0,
      byDepartment: [...deptMap.values()],
    };

    return { campaign, events, stats };
  } catch (err) {
    logger.error('Failed to generate phishing report', { campaignId, error: (err as Error).message });
    return null;
  }
}

// ─── List Campaigns ───────────────────────────────────────────────────────────

export async function listCampaigns(): Promise<PhishingCampaign[]> {
  try {
    return await query<PhishingCampaign>(
      `SELECT
         id, name, description, status, template_id AS "templateId",
         target_departments AS "targetDepartments", target_user_ids AS "targetUserIds",
         scheduled_at AS "scheduledAt", completed_at AS "completedAt",
         created_by AS "createdBy", created_at AS "createdAt",
         landing_page_url AS "landingPageUrl",
         total_targets AS "totalTargets", click_count AS "clickCount",
         report_count AS "reportCount",
         CASE WHEN total_targets > 0 THEN ROUND(100.0 * click_count / total_targets) END AS "clickRate",
         CASE WHEN total_targets > 0 THEN ROUND(100.0 * report_count / total_targets) END AS "reportRate"
       FROM phishing_campaigns
       ORDER BY created_at DESC`
    );
  } catch {
    return mockCampaigns;
  }
}

// ─── Calculate Risk Score ─────────────────────────────────────────────────────

export async function calculateRiskScore(userId: string): Promise<number> {
  try {
    const [result] = await query<{ riskScore: number }>(
      `WITH
         phishing_score AS (
           SELECT
             LEAST(50, COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END) * 15) AS score
           FROM phishing_events
           WHERE user_id = $1
         ),
         training_score AS (
           SELECT
             LEAST(30, COUNT(CASE WHEN status = 'overdue' THEN 1 END) * 10) AS score
           FROM enrollments
           WHERE user_id = $1
         ),
         quiz_score AS (
           SELECT
             GREATEST(0, 20 - COALESCE(AVG(quiz_score), 50) / 5)::int AS score
           FROM enrollments
           WHERE user_id = $1 AND quiz_score IS NOT NULL
         )
       SELECT
         LEAST(100, ps.score + ts.score + qs.score)::int AS "riskScore"
       FROM phishing_score ps, training_score ts, quiz_score qs`,
      [userId]
    );

    const score = result?.riskScore ?? 50;

    await query('UPDATE users SET risk_score = $1 WHERE id = $2', [score, userId]);

    return score;
  } catch (err) {
    logger.error('Failed to calculate risk score', { userId, error: (err as Error).message });
    return 50; // default medium risk
  }
}
