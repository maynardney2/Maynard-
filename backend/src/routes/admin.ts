import { Router, Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import { verifyToken } from '../middleware/auth';
import { requireRole, requireMinRole } from '../middleware/rbac';
import { auditLog } from '../middleware/audit';
import * as adminController from '../controllers/adminController';
import {
  listCampaigns,
  createCampaign,
  generateReport,
} from '../services/phishingService';
import { AppError } from '../middleware/errorHandler';

const router = Router();

// All admin routes require authentication + minimum role
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

// ─── User Management (admin only) ────────────────────────────────────────────

router.get('/users', requireRole('admin'), adminController.listUsers);

router.post(
  '/users',
  requireRole('admin'),
  [
    body('email').isEmail().normalizeEmail(),
    body('firstName').trim().notEmpty(),
    body('lastName').trim().notEmpty(),
    body('role').isIn(['employee', 'it_staff', 'manager', 'admin']),
    body('department').trim().notEmpty(),
    body('jobTitle').trim().notEmpty(),
    body('password').optional().isLength({ min: 8 }),
  ],
  handleValidation,
  auditLog('create', 'user'),
  adminController.createUser
);

router.put(
  '/users/:id',
  requireRole('admin'),
  [
    body('firstName').optional().trim().notEmpty(),
    body('lastName').optional().trim().notEmpty(),
    body('role').optional().isIn(['employee', 'it_staff', 'manager', 'admin']),
    body('isActive').optional().isBoolean(),
  ],
  handleValidation,
  auditLog('update', 'user'),
  adminController.updateUser
);

router.delete(
  '/users/:id',
  requireRole('admin'),
  auditLog('deactivate', 'user'),
  adminController.deleteUser
);

router.get(
  '/users/:id/activity',
  requireRole('admin'),
  adminController.getUserActivity
);

// ─── Course Management (it_staff or admin) ────────────────────────────────────

router.post(
  '/courses',
  requireMinRole('it_staff'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty(),
    body('category').isIn([
      'phishing', 'password_security', 'data_privacy', 'social_engineering',
      'network_security', 'incident_response', 'compliance', 'malware_awareness',
    ]),
    body('difficulty').isIn(['beginner', 'intermediate', 'advanced']),
    body('estimatedMinutes').isInt({ min: 1 }),
    body('passingScore').isInt({ min: 1, max: 100 }),
  ],
  handleValidation,
  auditLog('create', 'course'),
  adminController.adminCreateCourse
);

router.put(
  '/courses/:id',
  requireMinRole('it_staff'),
  auditLog('update', 'course'),
  adminController.adminUpdateCourse
);

router.delete(
  '/courses/:id',
  requireRole('admin'),
  auditLog('archive', 'course'),
  adminController.adminDeleteCourse
);

// ─── Course Assignments ───────────────────────────────────────────────────────

router.post(
  '/assignments',
  requireMinRole('manager'),
  [
    body('courseId').notEmpty().withMessage('courseId is required'),
    body('userIds').optional().isArray(),
    body('departments').optional().isArray(),
    body('dueDate').optional().isISO8601(),
  ],
  handleValidation,
  auditLog('assign', 'course'),
  adminController.assignCourses
);

// ─── Audit Logs (admin/it_staff/manager) ─────────────────────────────────────

router.get(
  '/audit-logs',
  requireMinRole('manager'),
  adminController.getAuditLogEntries
);

// ─── Phishing Campaigns ───────────────────────────────────────────────────────

router.post(
  '/phishing/campaigns',
  requireMinRole('it_staff'),
  [
    body('name').trim().notEmpty(),
    body('description').optional().isString(),
    body('templateId').notEmpty(),
    body('scheduledAt').isISO8601(),
    body('landingPageUrl').isURL(),
  ],
  handleValidation,
  auditLog('create', 'phishing_campaign'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const campaign = await createCampaign({
        ...req.body,
        createdBy: req.user!.userId,
        scheduledAt: new Date(req.body.scheduledAt),
      });
      res.status(201).json({ success: true, data: campaign });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/phishing/campaigns',
  requireMinRole('it_staff'),
  async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const campaigns = await listCampaigns();
      res.json({ success: true, data: campaigns });
    } catch (err) {
      next(err);
    }
  }
);

router.get(
  '/phishing/campaigns/:id/results',
  requireMinRole('it_staff'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await generateReport(req.params.id);
      if (!result) throw new AppError('Campaign not found', 404, 'NOT_FOUND');
      res.json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
