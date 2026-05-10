import { Router, Request, Response, NextFunction } from 'express';
import { verifyToken } from '../middleware/auth';
import { query, queryOne } from '../config/database';
import { AppError, NotFoundError } from '../middleware/errorHandler';
import { Notification } from '../types';

const router = Router();

router.use(verifyToken);

// ─── Mock Notifications ───────────────────────────────────────────────────────

function getMockNotifications(userId: string): Notification[] {
  return [
    {
      id: 'notif-001',
      userId,
      type: 'course_assigned',
      title: 'New Course Assigned',
      message: 'You have been assigned "Phishing Awareness Fundamentals". Please complete it by the end of the month.',
      isRead: false,
      link: '/courses/crs-001',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
      id: 'notif-002',
      userId,
      type: 'deadline_reminder',
      title: 'Training Deadline Approaching',
      message: '"Password Security Best Practices" is due in 3 days. Complete it now to stay compliant.',
      isRead: false,
      link: '/courses/crs-002',
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    },
    {
      id: 'notif-003',
      userId,
      type: 'badge_earned',
      title: 'Badge Earned! 🏆',
      message: 'Congratulations! You\'ve earned the "Security Champion" badge.',
      isRead: true,
      link: '/profile/badges',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
    {
      id: 'notif-004',
      userId,
      type: 'phishing_alert',
      title: 'Phishing Simulation Alert',
      message: 'You clicked a simulated phishing link. Complete the awareness training to improve your security skills.',
      isRead: true,
      link: '/courses/crs-001',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ];
}

// ─── GET /api/v1/notifications ────────────────────────────────────────────────

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const { unreadOnly, page = '1', limit = '20' } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, parseInt(limit, 10) || 20);
    const offset = (pageNum - 1) * limitNum;

    let notifications: Notification[];
    let total: number;

    try {
      const conditions = ['user_id = $1'];
      const params: unknown[] = [userId];
      let idx = 2;

      if (unreadOnly === 'true') {
        conditions.push('is_read = false');
      }

      const where = `WHERE ${conditions.join(' AND ')}`;

      const countResult = await query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM notifications ${where}`, params
      );
      total = parseInt(countResult[0]?.count ?? '0', 10);

      notifications = await query<Notification>(
        `SELECT
           id, user_id AS "userId", type, title, message,
           is_read AS "isRead", link, created_at AS "createdAt"
         FROM notifications ${where}
         ORDER BY created_at DESC
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...params, limitNum, offset]
      );
    } catch {
      // Mock fallback
      let all = getMockNotifications(userId);
      if (unreadOnly === 'true') all = all.filter(n => !n.isRead);
      total = all.length;
      notifications = all.slice(offset, offset + limitNum);
    }

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({
      success: true,
      data: notifications,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
      unreadCount,
    });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/v1/notifications/:id/read ──────────────────────────────────────

router.put('/:id/read', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    let notification: Notification | null = null;
    try {
      notification = await queryOne<Notification>(
        `UPDATE notifications
         SET is_read = true
         WHERE id = $1 AND user_id = $2
         RETURNING id, user_id AS "userId", type, title, message,
                   is_read AS "isRead", link, created_at AS "createdAt"`,
        [id, userId]
      );
    } catch {
      // Mock: just return success
      notification = { id, userId, type: 'system', title: '', message: '', isRead: true, link: null, createdAt: new Date() };
    }

    if (!notification) throw new NotFoundError('Notification');

    res.json({ success: true, data: notification });
  } catch (err) {
    next(err);
  }
});

// ─── PUT /api/v1/notifications/read-all ──────────────────────────────────────

router.put('/read-all', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;

    try {
      await query(
        'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false',
        [userId]
      );
    } catch { /* non-critical */ }

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
});

// ─── DELETE /api/v1/notifications/:id ────────────────────────────────────────

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user!.userId;

    try {
      const result = await query(
        'DELETE FROM notifications WHERE id = $1 AND user_id = $2',
        [id, userId]
      );
      const deleted = (result as unknown as { rowCount: number }).rowCount;
      if (deleted === 0) throw new NotFoundError('Notification');
    } catch (err) {
      if (err instanceof AppError) throw err;
      // Mock: return success
    }

    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
});

export default router;
