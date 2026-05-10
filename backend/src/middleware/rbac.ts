import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../types';

// ─── Role Hierarchy ──────────────────────────────────────────────────────────

const ROLE_HIERARCHY: Record<UserRole, number> = {
  employee: 1,
  it_staff: 2,
  manager: 3,
  admin: 4,
};

// ─── Permission Matrix ────────────────────────────────────────────────────────

type Resource =
  | 'users'
  | 'courses'
  | 'enrollments'
  | 'progress'
  | 'reports'
  | 'admin'
  | 'phishing'
  | 'audit_logs'
  | 'certificates'
  | 'notifications';

type Action = 'read' | 'write' | 'delete' | 'manage';

type PermissionMatrix = Record<Resource, Partial<Record<Action, UserRole[]>>>;

const PERMISSIONS: PermissionMatrix = {
  users: {
    read: ['employee', 'it_staff', 'manager', 'admin'],
    write: ['manager', 'admin'],
    delete: ['admin'],
    manage: ['admin'],
  },
  courses: {
    read: ['employee', 'it_staff', 'manager', 'admin'],
    write: ['it_staff', 'admin'],
    delete: ['admin'],
    manage: ['it_staff', 'admin'],
  },
  enrollments: {
    read: ['employee', 'it_staff', 'manager', 'admin'],
    write: ['employee', 'it_staff', 'manager', 'admin'],
    delete: ['admin'],
    manage: ['it_staff', 'manager', 'admin'],
  },
  progress: {
    read: ['employee', 'it_staff', 'manager', 'admin'],
    write: ['employee', 'it_staff', 'manager', 'admin'],
    delete: ['admin'],
    manage: ['admin'],
  },
  reports: {
    read: ['manager', 'admin'],
    write: ['admin'],
    delete: ['admin'],
    manage: ['admin'],
  },
  admin: {
    read: ['admin'],
    write: ['admin'],
    delete: ['admin'],
    manage: ['admin'],
  },
  phishing: {
    read: ['it_staff', 'manager', 'admin'],
    write: ['it_staff', 'admin'],
    delete: ['admin'],
    manage: ['it_staff', 'admin'],
  },
  audit_logs: {
    read: ['it_staff', 'manager', 'admin'],
    write: ['admin'],
    delete: ['admin'],
    manage: ['admin'],
  },
  certificates: {
    read: ['employee', 'it_staff', 'manager', 'admin'],
    write: ['it_staff', 'admin'],
    delete: ['admin'],
    manage: ['admin'],
  },
  notifications: {
    read: ['employee', 'it_staff', 'manager', 'admin'],
    write: ['employee', 'it_staff', 'manager', 'admin'],
    delete: ['employee', 'it_staff', 'manager', 'admin'],
    manage: ['admin'],
  },
};

// ─── Middleware Factories ────────────────────────────────────────────────────

/**
 * Require the authenticated user to have one of the specified roles.
 * Usage: router.get('/admin', verifyToken, requireRole('admin'))
 */
export function requireRole(...roles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        required: roles,
        current: req.user.role,
      });
      return;
    }

    next();
  };
}

/**
 * Require the user's role to be at or above the minimum role in the hierarchy.
 * e.g. requireMinRole('manager') allows manager and admin.
 */
export function requireMinRole(minRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const userLevel = ROLE_HIERARCHY[req.user.role];
    const requiredLevel = ROLE_HIERARCHY[minRole];

    if (userLevel < requiredLevel) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        requiredMinRole: minRole,
        current: req.user.role,
      });
      return;
    }

    next();
  };
}

/**
 * Check permission based on the permission matrix.
 */
export function requirePermission(resource: Resource, action: Action) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const allowedRoles = PERMISSIONS[resource]?.[action] ?? [];
    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: `You do not have permission to ${action} ${resource}`,
      });
      return;
    }

    next();
  };
}

/**
 * Allow a user to access only their own resource, unless they have elevated role.
 * Compares req.params.id with req.user.userId.
 * elevatedRoles defaults to ['manager', 'admin'].
 */
export function requireSelfOrRole(
  ...elevatedRoles: UserRole[]
) {
  const elevated = elevatedRoles.length > 0 ? elevatedRoles : (['manager', 'admin'] as UserRole[]);

  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ success: false, error: 'Authentication required' });
      return;
    }

    const targetId = req.params.id;
    if (req.user.userId === targetId || elevated.includes(req.user.role)) {
      next();
      return;
    }

    res.status(403).json({
      success: false,
      error: 'You can only access your own resources',
    });
  };
}

/**
 * Helper to check if a role has a given permission (non-middleware use).
 */
export function hasPermission(
  role: UserRole,
  resource: Resource,
  action: Action
): boolean {
  return (PERMISSIONS[resource]?.[action] ?? []).includes(role);
}
