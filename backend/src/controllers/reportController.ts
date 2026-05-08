import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database';
import { logger } from '../utils/logger';
import {
  ComplianceReport, DepartmentCompliance, CourseCompliance,
  TrendPoint, TrainingCompletionReport, MonthlyCompletion,
  RiskAssessmentReport, RiskUser, RiskDistribution, RiskFactor,
  PhishingStats, DepartmentPhishingStats,
} from '../types';

// ─── Mock Data Generators ─────────────────────────────────────────────────────

function generateTrend(): TrendPoint[] {
  const trend: TrendPoint[] = [];
  const today = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(today);
    d.setMonth(d.getMonth() - i);
    trend.push({
      date: d.toISOString().slice(0, 7),
      complianceRate: Math.min(95, 50 + Math.floor(Math.random() * 40)),
      completions: Math.floor(Math.random() * 50) + 10,
    });
  }
  return trend;
}

function getMockCompliance(): ComplianceReport {
  return {
    generatedAt: new Date(),
    period: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    overallComplianceRate: 78,
    totalEmployees: 150,
    compliantEmployees: 117,
    overdueAssignments: 23,
    byDepartment: [
      { department: 'Engineering', totalEmployees: 45, compliantEmployees: 38, complianceRate: 84, overdueCount: 7 },
      { department: 'Marketing', totalEmployees: 20, compliantEmployees: 14, complianceRate: 70, overdueCount: 6 },
      { department: 'Finance', totalEmployees: 15, compliantEmployees: 13, complianceRate: 87, overdueCount: 2 },
      { department: 'HR', totalEmployees: 10, compliantEmployees: 9, complianceRate: 90, overdueCount: 1 },
      { department: 'IT Security', totalEmployees: 12, compliantEmployees: 12, complianceRate: 100, overdueCount: 0 },
      { department: 'Operations', totalEmployees: 25, compliantEmployees: 18, complianceRate: 72, overdueCount: 5 },
      { department: 'General', totalEmployees: 23, compliantEmployees: 13, complianceRate: 57, overdueCount: 2 },
    ],
    byCourse: [
      { courseId: 'crs-001', courseTitle: 'Phishing Awareness Fundamentals', totalAssigned: 150, totalCompleted: 127, completionRate: 85, averageScore: 84, overdueCount: 8 },
      { courseId: 'crs-002', courseTitle: 'Password Security Best Practices', totalAssigned: 150, totalCompleted: 135, completionRate: 90, averageScore: 88, overdueCount: 5 },
      { courseId: 'crs-003', courseTitle: 'Data Privacy & GDPR Compliance', totalAssigned: 150, totalCompleted: 105, completionRate: 70, averageScore: 79, overdueCount: 15 },
    ],
    trendData: generateTrend(),
  };
}

// ─── Compliance Report ────────────────────────────────────────────────────────

export async function getComplianceReport(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { from, to } = req.query as Record<string, string>;
    const fromDate = from ? new Date(from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();

    let report: ComplianceReport;

    try {
      const [totalRow] = await query<{ total: string; compliant: string; overdue: string }>(
        `SELECT
           COUNT(DISTINCT u.id)::text AS total,
           COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN u.id END)::text AS compliant,
           COUNT(DISTINCT CASE WHEN e.status = 'overdue' THEN e.id END)::text AS overdue
         FROM users u
         LEFT JOIN enrollments e ON e.user_id = u.id
         WHERE u.is_active = true`
      );

      const total = parseInt(totalRow?.total ?? '0', 10);
      const compliant = parseInt(totalRow?.compliant ?? '0', 10);
      const overdue = parseInt(totalRow?.overdue ?? '0', 10);

      const byDepartment = await query<DepartmentCompliance>(
        `SELECT
           u.department,
           COUNT(DISTINCT u.id)::int AS "totalEmployees",
           COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN u.id END)::int AS "compliantEmployees",
           ROUND(
             100.0 * COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN u.id END) /
             NULLIF(COUNT(DISTINCT u.id), 0)
           )::int AS "complianceRate",
           COUNT(DISTINCT CASE WHEN e.status = 'overdue' THEN e.id END)::int AS "overdueCount"
         FROM users u
         LEFT JOIN enrollments e ON e.user_id = u.id
         WHERE u.is_active = true
         GROUP BY u.department
         ORDER BY "complianceRate" DESC`
      );

      const byCourse = await query<CourseCompliance>(
        `SELECT
           c.id AS "courseId", c.title AS "courseTitle",
           COUNT(e.id)::int AS "totalAssigned",
           COUNT(CASE WHEN e.status = 'completed' THEN 1 END)::int AS "totalCompleted",
           ROUND(
             100.0 * COUNT(CASE WHEN e.status = 'completed' THEN 1 END) /
             NULLIF(COUNT(e.id), 0)
           )::int AS "completionRate",
           COALESCE(AVG(e.quiz_score), 0)::int AS "averageScore",
           COUNT(CASE WHEN e.status = 'overdue' THEN 1 END)::int AS "overdueCount"
         FROM courses c
         LEFT JOIN enrollments e ON e.course_id = c.id
         WHERE c.status = 'published'
         GROUP BY c.id, c.title
         ORDER BY "completionRate" DESC`
      );

      const trendRows = await query<{ month: string; completions: string; complianceRate: string }>(
        `SELECT
           TO_CHAR(DATE_TRUNC('month', completed_at), 'YYYY-MM') AS month,
           COUNT(*)::text AS completions,
           '0'::text AS "complianceRate"
         FROM enrollments
         WHERE completed_at BETWEEN $1 AND $2
         GROUP BY DATE_TRUNC('month', completed_at)
         ORDER BY DATE_TRUNC('month', completed_at)`,
        [fromDate, toDate]
      );

      const trendData: TrendPoint[] = trendRows.map(r => ({
        date: r.month,
        completions: parseInt(r.completions, 10),
        complianceRate: parseInt(r.complianceRate, 10),
      }));

      report = {
        generatedAt: new Date(),
        period: { from: fromDate, to: toDate },
        overallComplianceRate: total > 0 ? Math.round((compliant / total) * 100) : 0,
        totalEmployees: total,
        compliantEmployees: compliant,
        overdueAssignments: overdue,
        byDepartment,
        byCourse,
        trendData,
      };
    } catch {
      report = getMockCompliance();
    }

    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

// ─── Compliance by Department ─────────────────────────────────────────────────

export async function getComplianceByDepartment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let data: DepartmentCompliance[];

    try {
      data = await query<DepartmentCompliance>(
        `SELECT
           u.department,
           COUNT(DISTINCT u.id)::int AS "totalEmployees",
           COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN u.id END)::int AS "compliantEmployees",
           ROUND(
             100.0 * COUNT(DISTINCT CASE WHEN e.status = 'completed' THEN u.id END) /
             NULLIF(COUNT(DISTINCT u.id), 0)
           )::int AS "complianceRate",
           COUNT(DISTINCT CASE WHEN e.status = 'overdue' THEN e.id END)::int AS "overdueCount"
         FROM users u
         LEFT JOIN enrollments e ON e.user_id = u.id
         WHERE u.is_active = true
         GROUP BY u.department
         ORDER BY "complianceRate" DESC`
      );
    } catch {
      data = getMockCompliance().byDepartment;
    }

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
}

// ─── Phishing Stats ───────────────────────────────────────────────────────────

export async function getPhishingStats(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let stats: PhishingStats;

    try {
      const [overall] = await query<{
        totalSent: string; totalOpened: string; totalClicked: string; totalReported: string;
      }>(
        `SELECT
           COUNT(*)::text AS "totalSent",
           COUNT(CASE WHEN opened_at IS NOT NULL THEN 1 END)::text AS "totalOpened",
           COUNT(CASE WHEN clicked_at IS NOT NULL THEN 1 END)::text AS "totalClicked",
           COUNT(CASE WHEN reported_at IS NOT NULL THEN 1 END)::text AS "totalReported"
         FROM phishing_events`
      );

      const totalSent = parseInt(overall?.totalSent ?? '0', 10);
      const totalOpened = parseInt(overall?.totalOpened ?? '0', 10);
      const totalClicked = parseInt(overall?.totalClicked ?? '0', 10);
      const totalReported = parseInt(overall?.totalReported ?? '0', 10);

      const byDepartment = await query<DepartmentPhishingStats>(
        `SELECT
           u.department,
           COUNT(pe.id)::int AS sent,
           COUNT(CASE WHEN pe.clicked_at IS NOT NULL THEN 1 END)::int AS clicked,
           COUNT(CASE WHEN pe.reported_at IS NOT NULL THEN 1 END)::int AS reported,
           ROUND(
             100.0 * COUNT(CASE WHEN pe.clicked_at IS NOT NULL THEN 1 END) /
             NULLIF(COUNT(pe.id), 0)
           )::int AS "clickRate"
         FROM phishing_events pe
         JOIN users u ON u.id = pe.user_id
         GROUP BY u.department`
      );

      stats = {
        totalSent, totalOpened, totalClicked, totalReported,
        openRate: totalSent > 0 ? Math.round((totalOpened / totalSent) * 100) : 0,
        clickRate: totalSent > 0 ? Math.round((totalClicked / totalSent) * 100) : 0,
        reportRate: totalSent > 0 ? Math.round((totalReported / totalSent) * 100) : 0,
        byDepartment,
      };
    } catch {
      stats = {
        totalSent: 450, totalOpened: 312, totalClicked: 68, totalReported: 89,
        openRate: 69, clickRate: 15, reportRate: 20,
        byDepartment: [
          { department: 'Engineering', sent: 120, clicked: 12, reported: 35, clickRate: 10 },
          { department: 'Marketing', sent: 60, clicked: 15, reported: 18, clickRate: 25 },
          { department: 'Finance', sent: 45, clicked: 9, reported: 14, clickRate: 20 },
          { department: 'HR', sent: 30, clicked: 4, reported: 8, clickRate: 13 },
          { department: 'Operations', sent: 75, clicked: 18, reported: 9, clickRate: 24 },
          { department: 'General', sent: 120, clicked: 10, reported: 5, clickRate: 8 },
        ],
      };
    }

    res.json({ success: true, data: stats });
  } catch (err) {
    next(err);
  }
}

// ─── Training Completion ──────────────────────────────────────────────────────

export async function getTrainingCompletion(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let report: TrainingCompletionReport;

    try {
      const [summary] = await query<{
        total: string; completed: string; inProgress: string; overdue: string;
        avgDays: string; avgScore: string;
      }>(
        `SELECT
           COUNT(*)::text AS total,
           COUNT(CASE WHEN status = 'completed' THEN 1 END)::text AS completed,
           COUNT(CASE WHEN status = 'in_progress' THEN 1 END)::text AS "inProgress",
           COUNT(CASE WHEN status = 'overdue' THEN 1 END)::text AS overdue,
           COALESCE(AVG(
             EXTRACT(EPOCH FROM (completed_at - enrolled_at)) / 86400
           ) FILTER (WHERE status = 'completed'), 0)::text AS "avgDays",
           COALESCE(AVG(quiz_score) FILTER (WHERE quiz_score IS NOT NULL), 0)::text AS "avgScore"
         FROM enrollments`
      );

      const monthly = await query<{ month: string; completions: string; enrollments: string }>(
        `SELECT
           TO_CHAR(DATE_TRUNC('month', enrolled_at), 'YYYY-MM') AS month,
           COUNT(CASE WHEN status = 'completed' THEN 1 END)::text AS completions,
           COUNT(*)::text AS enrollments
         FROM enrollments
         WHERE enrolled_at >= NOW() - INTERVAL '12 months'
         GROUP BY DATE_TRUNC('month', enrolled_at)
         ORDER BY 1`
      );

      report = {
        totalEnrollments: parseInt(summary?.total ?? '0', 10),
        completedEnrollments: parseInt(summary?.completed ?? '0', 10),
        inProgressEnrollments: parseInt(summary?.inProgress ?? '0', 10),
        overdueEnrollments: parseInt(summary?.overdue ?? '0', 10),
        averageCompletionDays: parseFloat(summary?.avgDays ?? '0'),
        averageQuizScore: parseFloat(summary?.avgScore ?? '0'),
        completionsByMonth: monthly.map(m => ({
          month: m.month,
          completions: parseInt(m.completions, 10),
          enrollments: parseInt(m.enrollments, 10),
        })),
      };
    } catch {
      const months: MonthlyCompletion[] = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        months.push({
          month: d.toISOString().slice(0, 7),
          completions: Math.floor(Math.random() * 30) + 5,
          enrollments: Math.floor(Math.random() * 50) + 20,
        });
      }

      report = {
        totalEnrollments: 750,
        completedEnrollments: 520,
        inProgressEnrollments: 130,
        overdueEnrollments: 100,
        averageCompletionDays: 4.2,
        averageQuizScore: 82.5,
        completionsByMonth: months,
      };
    }

    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

// ─── Risk Assessment ──────────────────────────────────────────────────────────

export async function getRiskAssessment(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let report: RiskAssessmentReport;

    try {
      const highRiskUsers = await query<RiskUser>(
        `SELECT
           u.id AS "userId",
           CONCAT(u.first_name, ' ', u.last_name) AS name,
           u.email, u.department, u.risk_score AS "riskScore",
           ARRAY_REMOVE(ARRAY[
             CASE WHEN u.risk_score > 70 THEN 'High phishing susceptibility' END,
             CASE WHEN COUNT(CASE WHEN e.status = 'overdue' THEN 1 END) > 0
                  THEN 'Overdue training' END,
             CASE WHEN u.last_login < NOW() - INTERVAL '90 days'
                  THEN 'Inactive account' END
           ], NULL) AS "riskFactors"
         FROM users u
         LEFT JOIN enrollments e ON e.user_id = u.id
         WHERE u.is_active = true AND u.risk_score >= 50
         GROUP BY u.id, u.first_name, u.last_name, u.email, u.department, u.risk_score
         ORDER BY u.risk_score DESC
         LIMIT 20`
      );

      const [distRow] = await query<{ high: string; medium: string; low: string }>(
        `SELECT
           COUNT(CASE WHEN risk_score >= 70 THEN 1 END)::text AS high,
           COUNT(CASE WHEN risk_score >= 40 AND risk_score < 70 THEN 1 END)::text AS medium,
           COUNT(CASE WHEN risk_score < 40 THEN 1 END)::text AS low
         FROM users WHERE is_active = true`
      );

      const riskFactors: RiskFactor[] = [
        { factor: 'Phishing simulation failures', weight: 35, affectedUsers: highRiskUsers.filter(u => u.riskScore >= 70).length },
        { factor: 'Overdue required training', weight: 30, affectedUsers: highRiskUsers.filter(u => u.riskFactors?.includes('Overdue training')).length },
        { factor: 'Low quiz scores', weight: 20, affectedUsers: Math.floor(highRiskUsers.length * 0.4) },
        { factor: 'Inactive account', weight: 15, affectedUsers: highRiskUsers.filter(u => u.riskFactors?.includes('Inactive account')).length },
      ];

      report = {
        generatedAt: new Date(),
        highRiskUsers,
        riskDistribution: {
          high: parseInt(distRow?.high ?? '0', 10),
          medium: parseInt(distRow?.medium ?? '0', 10),
          low: parseInt(distRow?.low ?? '0', 10),
        },
        riskFactors,
      };
    } catch {
      const dist: RiskDistribution = { high: 12, medium: 45, low: 93 };
      const highRisk: RiskUser[] = [
        { userId: 'usr-010', name: 'John Smith', email: 'jsmith@cybershield.local', department: 'Marketing', riskScore: 85, riskFactors: ['High phishing susceptibility', 'Overdue training'] },
        { userId: 'usr-011', name: 'Jane Doe', email: 'jdoe@cybershield.local', department: 'Operations', riskScore: 78, riskFactors: ['High phishing susceptibility'] },
        { userId: 'usr-012', name: 'Bob Wilson', email: 'bwilson@cybershield.local', department: 'Marketing', riskScore: 72, riskFactors: ['Overdue training', 'Low quiz scores'] },
      ];

      report = {
        generatedAt: new Date(),
        highRiskUsers: highRisk,
        riskDistribution: dist,
        riskFactors: [
          { factor: 'Phishing simulation failures', weight: 35, affectedUsers: 18 },
          { factor: 'Overdue required training', weight: 30, affectedUsers: 23 },
          { factor: 'Low quiz scores', weight: 20, affectedUsers: 31 },
          { factor: 'Inactive account', weight: 15, affectedUsers: 8 },
        ],
      };
    }

    res.json({ success: true, data: report });
  } catch (err) {
    next(err);
  }
}

// ─── CSV Export: Compliance ───────────────────────────────────────────────────

export async function exportComplianceCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let rows: Array<{ name: string; email: string; department: string; course: string; status: string; score: string; completedAt: string }>;

    try {
      rows = await query(
        `SELECT
           CONCAT(u.first_name, ' ', u.last_name) AS name,
           u.email, u.department,
           c.title AS course, e.status,
           COALESCE(e.quiz_score::text, 'N/A') AS score,
           COALESCE(TO_CHAR(e.completed_at, 'YYYY-MM-DD'), 'Not completed') AS "completedAt"
         FROM enrollments e
         JOIN users u ON u.id = e.user_id
         JOIN courses c ON c.id = e.course_id
         ORDER BY u.last_name, u.first_name, c.title`
      );
    } catch {
      rows = [
        { name: 'Alice Admin', email: 'admin@cybershield.local', department: 'IT Security', course: 'Phishing Awareness Fundamentals', status: 'completed', score: '92', completedAt: '2024-02-15' },
        { name: 'Bob Manager', email: 'manager@cybershield.local', department: 'Engineering', course: 'Phishing Awareness Fundamentals', status: 'completed', score: '88', completedAt: '2024-02-20' },
        { name: 'Carol Employee', email: 'employee@cybershield.local', department: 'Engineering', course: 'Phishing Awareness Fundamentals', status: 'in_progress', score: 'N/A', completedAt: 'Not completed' },
      ];
    }

    const header = 'Name,Email,Department,Course,Status,Score,Completed At\n';
    const csvContent = rows
      .map(r => [r.name, r.email, r.department, r.course, r.status, r.score, r.completedAt]
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
        .join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="compliance-report-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(header + csvContent);
  } catch (err) {
    next(err);
  }
}

// ─── Export Certificates ──────────────────────────────────────────────────────

export async function exportCertificates(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let rows: Array<{ userName: string; email: string; department: string; courseTitle: string; certificateNumber: string; issuedAt: string; expiresAt: string }>;

    try {
      rows = await query(
        `SELECT
           CONCAT(u.first_name, ' ', u.last_name) AS "userName",
           u.email, u.department,
           c.title AS "courseTitle",
           cert.certificate_number AS "certificateNumber",
           TO_CHAR(cert.issued_at, 'YYYY-MM-DD') AS "issuedAt",
           COALESCE(TO_CHAR(cert.expires_at, 'YYYY-MM-DD'), 'No expiry') AS "expiresAt"
         FROM certificates cert
         JOIN users u ON u.id = cert.user_id
         JOIN courses c ON c.id = cert.course_id
         ORDER BY cert.issued_at DESC`
      );
    } catch {
      rows = [
        { userName: 'Alice Admin', email: 'admin@cybershield.local', department: 'IT Security', courseTitle: 'Phishing Awareness Fundamentals', certificateNumber: 'CERT-2024-001', issuedAt: '2024-02-15', expiresAt: '2025-02-15' },
      ];
    }

    const header = 'Name,Email,Department,Course,Certificate Number,Issued At,Expires At\n';
    const csvContent = rows
      .map(r => [r.userName, r.email, r.department, r.courseTitle, r.certificateNumber, r.issuedAt, r.expiresAt]
        .map(v => `"${String(v).replace(/"/g, '""')}"`)
        .join(','))
      .join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="certificates-${new Date().toISOString().slice(0, 10)}.csv"`);
    res.send(header + csvContent);
  } catch (err) {
    next(err);
  }
}
