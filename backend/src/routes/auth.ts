import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import * as authController from '../controllers/authController';
import { verifyToken } from '../middleware/auth';

const router = Router();

// ─── Validation Middleware ────────────────────────────────────────────────────

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

// ─── Routes ───────────────────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/login
 * Email + password authentication
 */
router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  handleValidation,
  authController.login
);

/**
 * POST /api/v1/auth/login/microsoft
 * Microsoft SSO — accepts idToken or code
 */
router.post(
  '/login/microsoft',
  [
    body('idToken').optional().isString(),
    body('code').optional().isString(),
  ],
  handleValidation,
  authController.microsoftLogin
);

/**
 * POST /api/v1/auth/refresh
 * Refresh access token using refresh token
 */
router.post(
  '/refresh',
  [
    body('refreshToken').notEmpty().withMessage('refreshToken is required'),
  ],
  handleValidation,
  authController.refresh
);

/**
 * POST /api/v1/auth/logout
 * Invalidate session (token blacklisting stub)
 */
router.post('/logout', verifyToken, authController.logout);

/**
 * POST /api/v1/auth/forgot-password
 */
router.post(
  '/forgot-password',
  [
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  ],
  handleValidation,
  authController.forgotPassword
);

/**
 * POST /api/v1/auth/reset-password
 */
router.post(
  '/reset-password',
  [
    body('token').notEmpty().withMessage('Reset token is required'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  ],
  handleValidation,
  authController.resetPassword
);

/**
 * GET /api/v1/auth/me
 * Returns current authenticated user
 */
router.get('/me', verifyToken, authController.getMe);

export default router;
