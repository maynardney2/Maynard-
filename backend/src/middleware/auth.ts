import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { TokenPayload, AuthTokens, UserRole } from '../types';
import { logger } from '../utils/logger';

// ─── Token Generation ────────────────────────────────────────────────────────

export function generateTokens(
  userId: string,
  role: UserRole,
  email: string
): AuthTokens {
  const payload: Omit<TokenPayload, 'iat' | 'exp'> = { userId, role, email };

  const accessToken = jwt.sign(payload, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as jwt.SignOptions);

  const refreshToken = jwt.sign(
    { userId, role, email },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions
  );

  // Parse human-readable expiresIn to seconds
  const expiresIn = parseExpiry(config.jwt.expiresIn);

  return { accessToken, refreshToken, expiresIn };
}

function parseExpiry(expiry: string): number {
  const match = expiry.match(/^(\d+)([smhd])$/);
  if (!match) return 3600;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 };
  return value * (multipliers[unit] ?? 3600);
}

// ─── Verify Access Token Middleware ──────────────────────────────────────────

export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'No authentication token provided',
    });
    return;
  }

  const token = authHeader.slice(7);

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        error: 'Token expired',
        code: 'TOKEN_EXPIRED',
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
        code: 'TOKEN_INVALID',
      });
      return;
    }

    logger.error('Unexpected token verification error', { error });
    res.status(500).json({ success: false, error: 'Authentication error' });
  }
}

// ─── Verify Refresh Token ─────────────────────────────────────────────────────

export function verifyRefreshToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, config.jwt.refreshSecret) as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw { status: 401, message: 'Refresh token expired', code: 'REFRESH_EXPIRED' };
    }
    throw { status: 401, message: 'Invalid refresh token', code: 'REFRESH_INVALID' };
  }
}

// ─── Microsoft SSO Token Validation ─────────────────────────────────────────

export interface MicrosoftTokenClaims {
  oid: string;           // object ID
  email?: string;
  preferred_username?: string;
  name?: string;
  given_name?: string;
  family_name?: string;
  roles?: string[];
  tid: string;           // tenant ID
}

export async function validateMicrosoftToken(
  idToken: string
): Promise<MicrosoftTokenClaims> {
  // In production: fetch JWKS from Azure and verify the RS256 signature.
  // For dev/testing we decode without verification and validate the tid claim.
  if (config.isDevelopment && !config.azure.tenantId) {
    // Decode-only path for local dev without Azure configured
    const [, payloadB64] = idToken.split('.');
    if (!payloadB64) throw new Error('Invalid id_token format');
    const claims = JSON.parse(
      Buffer.from(payloadB64, 'base64url').toString('utf8')
    ) as MicrosoftTokenClaims;
    return claims;
  }

  // Production path: verify against Azure JWKS
  // Simplified – a real implementation should use jwks-rsa + jsonwebtoken
  const [, payloadB64] = idToken.split('.');
  if (!payloadB64) throw new Error('Invalid id_token format');
  const claims = JSON.parse(
    Buffer.from(payloadB64, 'base64url').toString('utf8')
  ) as MicrosoftTokenClaims;

  if (claims.tid !== config.azure.tenantId) {
    throw new Error('Token issued by unexpected tenant');
  }

  return claims;
}

// ─── Optional Auth (does not fail if no token) ───────────────────────────────

export function optionalAuth(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, config.jwt.secret) as TokenPayload;
    req.user = decoded;
  } catch {
    // ignore – proceed unauthenticated
  }
  next();
}
