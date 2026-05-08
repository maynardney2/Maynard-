import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { verifyToken } from '../middleware/auth';
import { requireSelfOrRole } from '../middleware/rbac';
import { auditLog } from '../middleware/audit';
import { query, queryOne } from '../config/database';
import { AppError, NotFoundError } from '../middleware/errorHandler';
import { User, Enrollment, Certificate, UserBadge, ChangePasswordRequest } from '../types';

const router = Router();

// All user routes require auth
router.use(verifyToken);

// ─── Validation Helper ────────────────────────────────────────────────────────

function handleValidation(req: Request, res: Response, next: NextFunction): void {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(422).json({
      success: false,
      error: 'Validation failed',
      fields: Object.fromEntries(
        errors.array().map(e => [
          (e as { path?: string; param?: string }).path ??
          (e as { path?: string; param?: string }).param ??
          'unknown',
          e.msg,
        ])
      ),
    });
    return;
  }
  next();
}

// ─── GET /api/v1/users/me ─────────────────────────────────────────────────────

router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    let user: User | null = null;
    try {
      user = await queryOne<User>(
        `SELECT
           id, email, first_name AS "firstName", last_name AS "lastName", role, department,
           job_title AS "jobTitle", manager_id AS "managerId", avatar_url AS "avatarUrl",
           is_active AS "isActive", last_login AS "lastLogin", created_at AS "createdAt",
           updated_at AS "updatedAt", microsoft_id AS "microsoftId",
           phone_number AS "phoneNumber", risk_score AS "riskScore"
         FROM users WHERE id = $1`,
        [userId]
      );
    } catch {
      // Demo fallback
      user = {
        id: userId, email: req.user!.email, firstName: 'Demo', lastName: 'User',
        role: req.user!.role, department: 'General', jobTitle: 'Employee',
        managerId: null, avatarUrl: null, isActive: true, lastLogin: new Date(),
        createdAt: new Date(), updatedAt: new Date(),
        microsoftId: null, phoneNumber: null, riskScore: 50,
      };
    }

    if (!user) throw new NotFoundError('User');

    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/v1/users/me ─────────────────────────────────────────────────────

router.put(
  '/me',
  [
    body('firstName').optional().trim().notEmpty().withMessage('First name cannot be empty'),
    body('lastName').optional().trim().notEmpty().withMessage('Last name cannot be empty'),
    body('phoneNumber').optional().isMobilePhone('any').withMessage('Invalid phone number'),
  ],
  handleValidation,
  auditLog('update', 'user'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { firstName, lastName, phoneNumber } = req.body as {
        firstName?: string; lastName?: string; phoneNumber?: string;
      };

      const setClauses: string[] = [];
      const params: unknown[] = [];
      let idx = 1;

      if (firstName) { setClauses.push(`first_name = $${idx++}`); params.push(firstName); }
      if (lastName) { setClauses.push(`last_name = $${idx++}`); params.push(lastName); }
      if (phoneNumber !== undefined) { setClauses.push(`phone_number = $${idx++}`); params.push(phoneNumber); }

      if (!setClauses.length) throw new AppError('No fields to update', 400, 'NO_UPDATES');

      setClauses.push('updated_at = NOW()');
      params.push(userId);

      let user: User | null = null;
      try {
        user = await queryOne<User>(
          `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${idx}
           RETURNING
             id, email, first_name AS "firstName", last_name AS "lastName", role, department,
             job_title AS "jobTitle", manager_id AS "managerId", avatar_url AS "avatarUrl",
             is_active AS "isActive", last_login AS "lastLogin", created_at AS "createdAt",
             updated_at AS "updatedAt", microsoft_id AS "microsoftId",
             phone_number AS "phoneNumber", risk_score AS "riskScore"`,
          params
        );
      } catch (err) {
        if (err instanceof AppError) throw err;
        throw new AppError('Database unavailable', 503, 'DB_OFFLINE');
      }

      if (!user) throw new NotFoundError('User');

      res.json({ success: true, data: user });
    } catch (err) {
      next(err);
    }
  }
);

// ─── PUT /api/v1/users/me/password ───────────────────────────────────────────

router.put(
  '/me/password',
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Must contain an uppercase letter')
      .matches(/[0-9]/).withMessage('Must contain a number'),
  ],
  handleValidation,
  auditLog('change_password', 'user'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user!.userId;
      const { currentPassword, newPassword }: ChangePasswordRequest = req.body;

      let passwordHash: string | null = null;
      try {
        const row = await queryOne<{ passwordHash: string | null }>(
          'SELECT password_hash AS "passwordHash" FROM users WHERE id = $1',
          [userId]
        );
        passwordHash = row?.passwordHash ?? null;
      } catch {
        throw new AppError('Database unavailable', 503, 'DB_OFFLINE');
      }

      if (!passwordHash) {
        throw new AppError('This account uses Microsoft SSO and cannot change password here', 400, 'SSO_ACCOUNT');
      }

      const valid = await bcrypt.compare(currentPassword, passwordHash);
      if (!valid) throw new AppError('Current password is incorrect', 401, 'WRONG_PASSWORD');

      const newHash = await bcrypt.hash(newPassword, 12);
      await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [newHash, userId]);

      res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/v1/users/:id/progress ──────────────────────────────────────────

router.get(
  '/:id/progress',
  requireSelfOrRole('manager', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      let enrollments: Enrollment[];
      try {
        enrollments = await query<Enrollment>(
          `SELECT
             e.id, e.user_id AS "userId", e.course_id AS "courseId", e.status,
             e.enrolled_at AS "enrolledAt", e.started_at AS "startedAt",
             e.completed_at AS "completedAt", e.due_date AS "dueDate",
             e.progress_percent AS "progressPercent", e.quiz_score AS "quizScore",
             e.assigned_by AS "assignedBy",
             json_build_object(
               'id', c.id, 'title', c.title, 'category', c.category,
               'difficulty', c.difficulty, 'estimatedMinutes', c.estimated_minutes,
               'thumbnailUrl', c.thumbnail_url, 'passingScore', c.passing_score
             ) AS course
           FROM enrollments e
           JOIN courses c ON c.id = e.course_id
           WHERE e.user_id = $1
           ORDER BY e.enrolled_at DESC`,
          [id]
        );
      } catch {
        enrollments = [];
      }

      res.json({ success: true, data: enrollments });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/v1/users/:id/certificates ──────────────────────────────────────

router.get(
  '/:id/certificates',
  requireSelfOrRole('manager', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      let certificates: Certificate[];
      try {
        certificates = await query<Certificate>(
          `SELECT
             cert.id, cert.user_id AS "userId", cert.course_id AS "courseId",
             cert.issued_at AS "issuedAt", cert.expires_at AS "expiresAt",
             cert.certificate_number AS "certificateNumber",
             c.title AS "courseTitle",
             CONCAT(u.first_name, ' ', u.last_name) AS "userName"
           FROM certificates cert
           JOIN courses c ON c.id = cert.course_id
           JOIN users u ON u.id = cert.user_id
           WHERE cert.user_id = $1
           ORDER BY cert.issued_at DESC`,
          [id]
        );
      } catch {
        certificates = [];
      }

      res.json({ success: true, data: certificates });
    } catch (err) {
      next(err);
    }
  }
);

// ─── GET /api/v1/users/:id/badges ────────────────────────────────────────────

router.get(
  '/:id/badges',
  requireSelfOrRole('manager', 'admin'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      let badges: UserBadge[];
      try {
        badges = await query<UserBadge>(
          `SELECT
             ub.id, ub.user_id AS "userId", ub.badge_id AS "badgeId",
             ub.earned_at AS "earnedAt",
             json_build_object(
               'id', b.id, 'name', b.name, 'description', b.description,
               'iconUrl', b.icon_url, 'criteria', b.criteria
             ) AS badge
           FROM user_badges ub
           JOIN badges b ON b.id = ub.badge_id
           WHERE ub.user_id = $1
           ORDER BY ub.earned_at DESC`,
          [id]
        );
      } catch {
        badges = [];
      }

      res.json({ success: true, data: badges });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
