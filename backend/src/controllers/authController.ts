import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

import { query, queryOne } from '../config/database';
import { generateTokens, verifyRefreshToken, validateMicrosoftToken } from '../middleware/auth';
import { logger } from '../utils/logger';
import { sendPasswordResetEmail } from '../services/emailService';
import { AppError } from '../middleware/errorHandler';
import {
  User, UserWithPassword, LoginRequest, TokenPayload,
  RefreshTokenRequest, ForgotPasswordRequest, ResetPasswordRequest,
} from '../types';

// ─── Mock Users (demo / no-DB fallback) ─────────────────────────────────────

const MOCK_USERS: UserWithPassword[] = [
  {
    id: 'usr-001',
    email: 'admin@cybershield.local',
    firstName: 'Alice',
    lastName: 'Admin',
    role: 'admin',
    department: 'IT Security',
    jobTitle: 'Security Administrator',
    managerId: null,
    avatarUrl: null,
    isActive: true,
    lastLogin: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    microsoftId: null,
    phoneNumber: null,
    riskScore: 5,
    passwordHash: bcrypt.hashSync('Admin@123', 10),
  },
  {
    id: 'usr-002',
    email: 'manager@cybershield.local',
    firstName: 'Bob',
    lastName: 'Manager',
    role: 'manager',
    department: 'Engineering',
    jobTitle: 'Engineering Manager',
    managerId: null,
    avatarUrl: null,
    isActive: true,
    lastLogin: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    microsoftId: null,
    phoneNumber: null,
    riskScore: 15,
    passwordHash: bcrypt.hashSync('Manager@123', 10),
  },
  {
    id: 'usr-003',
    email: 'employee@cybershield.local',
    firstName: 'Carol',
    lastName: 'Employee',
    role: 'employee',
    department: 'Engineering',
    jobTitle: 'Software Engineer',
    managerId: 'usr-002',
    avatarUrl: null,
    isActive: true,
    lastLogin: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    microsoftId: null,
    phoneNumber: null,
    riskScore: 25,
    passwordHash: bcrypt.hashSync('Employee@123', 10),
  },
  {
    id: 'usr-004',
    email: 'itstaff@cybershield.local',
    firstName: 'Dave',
    lastName: 'IT',
    role: 'it_staff',
    department: 'IT Security',
    jobTitle: 'IT Security Analyst',
    managerId: 'usr-001',
    avatarUrl: null,
    isActive: true,
    lastLogin: null,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    microsoftId: null,
    phoneNumber: null,
    riskScore: 10,
    passwordHash: bcrypt.hashSync('ITStaff@123', 10),
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function stripPassword(u: UserWithPassword): User {
  const { passwordHash: _, ...user } = u;
  return user as User;
}

async function findUserByEmail(email: string): Promise<UserWithPassword | null> {
  try {
    return await queryOne<UserWithPassword>(
      `SELECT
         id, email, first_name AS "firstName", last_name AS "lastName",
         role, department, job_title AS "jobTitle", manager_id AS "managerId",
         avatar_url AS "avatarUrl", is_active AS "isActive",
         last_login AS "lastLogin", created_at AS "createdAt",
         updated_at AS "updatedAt", microsoft_id AS "microsoftId",
         phone_number AS "phoneNumber", risk_score AS "riskScore",
         password_hash AS "passwordHash"
       FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );
  } catch {
    // DB unavailable — fall back to mock users
    return MOCK_USERS.find(u => u.email === email.toLowerCase()) ?? null;
  }
}

async function findUserById(id: string): Promise<UserWithPassword | null> {
  try {
    return await queryOne<UserWithPassword>(
      `SELECT
         id, email, first_name AS "firstName", last_name AS "lastName",
         role, department, job_title AS "jobTitle", manager_id AS "managerId",
         avatar_url AS "avatarUrl", is_active AS "isActive",
         last_login AS "lastLogin", created_at AS "createdAt",
         updated_at AS "updatedAt", microsoft_id AS "microsoftId",
         phone_number AS "phoneNumber", risk_score AS "riskScore",
         password_hash AS "passwordHash"
       FROM users WHERE id = $1`,
      [id]
    );
  } catch {
    return MOCK_USERS.find(u => u.id === id) ?? null;
  }
}

async function updateLastLogin(userId: string): Promise<void> {
  try {
    await query('UPDATE users SET last_login = NOW() WHERE id = $1', [userId]);
  } catch {
    // non-critical
  }
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(
  req: Request<object, object, LoginRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new AppError('Email and password are required', 400, 'MISSING_CREDENTIALS');
    }

    const user = await findUserByEmail(email);
    if (!user || !user.isActive) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    if (!user.passwordHash) {
      throw new AppError(
        'This account uses Microsoft SSO. Please sign in with Microsoft.',
        401,
        'SSO_REQUIRED'
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
    }

    const tokens = generateTokens(user.id, user.role, user.email);
    await updateLastLogin(user.id);

    logger.info('User logged in', { userId: user.id, email: user.email });

    res.json({
      success: true,
      data: {
        user: stripPassword(user),
        ...tokens,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── Microsoft SSO Login ──────────────────────────────────────────────────────

export async function microsoftLogin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { idToken, code } = req.body as { idToken?: string; code?: string };

    if (!idToken && !code) {
      throw new AppError('id_token or code is required', 400, 'MISSING_TOKEN');
    }

    // Accept an id_token directly or treat code as id_token for dev convenience
    const tokenToValidate = idToken ?? code ?? '';
    const claims = await validateMicrosoftToken(tokenToValidate);

    const microsoftId = claims.oid;
    const email = (claims.email ?? claims.preferred_username ?? '').toLowerCase();

    if (!email) {
      throw new AppError('Unable to determine email from Microsoft token', 400, 'NO_EMAIL');
    }

    // Try to find existing user by Microsoft ID, then by email
    let user: UserWithPassword | null = null;
    try {
      user = await queryOne<UserWithPassword>(
        `SELECT
           id, email, first_name AS "firstName", last_name AS "lastName",
           role, department, job_title AS "jobTitle", manager_id AS "managerId",
           avatar_url AS "avatarUrl", is_active AS "isActive",
           last_login AS "lastLogin", created_at AS "createdAt",
           updated_at AS "updatedAt", microsoft_id AS "microsoftId",
           phone_number AS "phoneNumber", risk_score AS "riskScore",
           password_hash AS "passwordHash"
         FROM users WHERE microsoft_id = $1 OR email = $2
         ORDER BY microsoft_id NULLS LAST LIMIT 1`,
        [microsoftId, email]
      );
    } catch {
      // fallback – check mock users
      user = MOCK_USERS.find(u => u.email === email) ?? null;
    }

    if (!user) {
      // Auto-provision the user
      const nameParts = (claims.name ?? email).split(' ');
      const firstName = claims.given_name ?? nameParts[0] ?? 'Unknown';
      const lastName = claims.family_name ?? nameParts.slice(1).join(' ') ?? 'User';
      const id = uuidv4();

      try {
        const rows = await query<UserWithPassword>(
          `INSERT INTO users
             (id, email, first_name, last_name, role, department, job_title,
              microsoft_id, is_active, risk_score, created_at, updated_at)
           VALUES ($1, $2, $3, $4, 'employee', 'General', 'Employee', $5, true, 50, NOW(), NOW())
           RETURNING
             id, email, first_name AS "firstName", last_name AS "lastName",
             role, department, job_title AS "jobTitle", manager_id AS "managerId",
             avatar_url AS "avatarUrl", is_active AS "isActive",
             last_login AS "lastLogin", created_at AS "createdAt",
             updated_at AS "updatedAt", microsoft_id AS "microsoftId",
             phone_number AS "phoneNumber", risk_score AS "riskScore",
             password_hash AS "passwordHash"`,
          [id, email, firstName, lastName, microsoftId]
        );
        user = rows[0] ?? null;
      } catch {
        // Mock fallback for dev
        user = {
          id,
          email,
          firstName,
          lastName,
          role: 'employee',
          department: 'General',
          jobTitle: 'Employee',
          managerId: null,
          avatarUrl: null,
          isActive: true,
          lastLogin: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          microsoftId,
          phoneNumber: null,
          riskScore: 50,
          passwordHash: null,
        };
      }
    }

    if (!user || !user.isActive) {
      throw new AppError('Account is disabled', 401, 'ACCOUNT_DISABLED');
    }

    // Sync microsoftId if newly linked
    if (!user.microsoftId) {
      try {
        await query('UPDATE users SET microsoft_id = $1 WHERE id = $2', [microsoftId, user.id]);
      } catch { /* non-critical */ }
    }

    const tokens = generateTokens(user.id, user.role, user.email);
    await updateLastLogin(user.id);

    logger.info('User logged in via Microsoft SSO', { userId: user.id, email: user.email });

    res.json({
      success: true,
      data: {
        user: stripPassword(user),
        ...tokens,
      },
    });
  } catch (err) {
    next(err);
  }
}

// ─── Refresh Token ────────────────────────────────────────────────────────────

export async function refresh(
  req: Request<object, object, RefreshTokenRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw new AppError('Refresh token is required', 400, 'MISSING_TOKEN');
    }

    let payload: TokenPayload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (e) {
      const err = e as { message: string; status: number; code: string };
      throw new AppError(err.message, err.status, err.code);
    }

    const user = await findUserById(payload.userId);
    if (!user || !user.isActive) {
      throw new AppError('User not found or inactive', 401, 'INVALID_USER');
    }

    const tokens = generateTokens(user.id, user.role, user.email);

    res.json({ success: true, data: tokens });
  } catch (err) {
    next(err);
  }
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // In a production system you'd blacklist the token in Redis here.
    // For now we just acknowledge the logout.
    logger.info('User logged out', { userId: req.user?.userId });
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export async function forgotPassword(
  req: Request<object, object, ForgotPasswordRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError('Email is required', 400, 'MISSING_EMAIL');
    }

    const user = await findUserByEmail(email);

    // Always respond 200 to avoid user enumeration
    if (user && user.isActive && user.passwordHash) {
      const resetToken = crypto.randomBytes(32).toString('hex');
      const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

      try {
        await query(
          `INSERT INTO password_reset_tokens (id, user_id, token_hash, expires_at, created_at)
           VALUES ($1, $2, $3, $4, NOW())
           ON CONFLICT (user_id) DO UPDATE
             SET token_hash = EXCLUDED.token_hash,
                 expires_at = EXCLUDED.expires_at,
                 created_at = NOW()`,
          [uuidv4(), user.id, tokenHash, expiresAt]
        );
      } catch {
        // DB unavailable — proceed in dev mode without persisting
      }

      try {
        await sendPasswordResetEmail(user, resetToken);
      } catch (emailErr) {
        logger.error('Failed to send password reset email', {
          userId: user.id,
          error: (emailErr as Error).message,
        });
      }
    }

    res.json({
      success: true,
      message: 'If an account with that email exists, a reset link has been sent.',
    });
  } catch (err) {
    next(err);
  }
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export async function resetPassword(
  req: Request<object, object, ResetPasswordRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token, newPassword } = req.body;
    if (!token || !newPassword) {
      throw new AppError('Token and new password are required', 400, 'MISSING_FIELDS');
    }

    if (newPassword.length < 8) {
      throw new AppError('Password must be at least 8 characters', 400, 'WEAK_PASSWORD');
    }

    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    let userId: string | null = null;
    try {
      const row = await queryOne<{ userId: string }>(
        `SELECT user_id AS "userId"
         FROM password_reset_tokens
         WHERE token_hash = $1 AND expires_at > NOW() AND used_at IS NULL`,
        [tokenHash]
      );
      userId = row?.userId ?? null;
    } catch {
      throw new AppError('Password reset is unavailable — database offline', 503, 'DB_OFFLINE');
    }

    if (!userId) {
      throw new AppError('Invalid or expired reset token', 400, 'INVALID_RESET_TOKEN');
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    await query('UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2', [
      passwordHash,
      userId,
    ]);
    await query(
      'UPDATE password_reset_tokens SET used_at = NOW() WHERE token_hash = $1',
      [tokenHash]
    );

    logger.info('Password reset successful', { userId });

    res.json({ success: true, message: 'Password reset successfully. You may now log in.' });
  } catch (err) {
    next(err);
  }
}

// ─── Get Current User (me) ────────────────────────────────────────────────────

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Not authenticated', 401, 'UNAUTHORIZED');
    }

    const user = await findUserById(req.user.userId);
    if (!user || !user.isActive) {
      throw new AppError('User not found', 404, 'USER_NOT_FOUND');
    }

    res.json({ success: true, data: stripPassword(user) });
  } catch (err) {
    next(err);
  }
}
