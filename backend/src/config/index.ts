import dotenv from 'dotenv';

dotenv.config();

function required(key: string): string {
  const value = process.env[key];
  if (!value) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    return '';
  }
  return value;
}

function optional(key: string, defaultValue: string): string {
  return process.env[key] ?? defaultValue;
}

function optionalNumber(key: string, defaultValue: number): number {
  const value = process.env[key];
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

export const config = {
  env: optional('NODE_ENV', 'development'),
  port: optionalNumber('PORT', 3001),
  isProduction: optional('NODE_ENV', 'development') === 'production',
  isDevelopment: optional('NODE_ENV', 'development') === 'development',

  database: {
    url: optional(
      'DATABASE_URL',
      'postgresql://user:password@localhost:5432/cybershield_lms'
    ),
    poolMin: optionalNumber('DB_POOL_MIN', 2),
    poolMax: optionalNumber('DB_POOL_MAX', 10),
    idleTimeoutMs: optionalNumber('DB_IDLE_TIMEOUT', 30000),
    connectionTimeoutMs: optionalNumber('DB_CONNECT_TIMEOUT', 2000),
  },

  jwt: {
    secret: optional('JWT_SECRET', 'dev-secret-change-in-production-32chars'),
    refreshSecret: optional(
      'JWT_REFRESH_SECRET',
      'dev-refresh-secret-change-in-prod'
    ),
    expiresIn: optional('JWT_EXPIRES_IN', '1h'),
    refreshExpiresIn: optional('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  azure: {
    tenantId: optional('AZURE_TENANT_ID', ''),
    clientId: optional('AZURE_CLIENT_ID', ''),
    clientSecret: optional('AZURE_CLIENT_SECRET', ''),
    redirectUri: optional('AZURE_REDIRECT_URI', 'http://localhost:3000/auth/callback'),
  },

  smtp: {
    host: optional('SMTP_HOST', 'smtp.office365.com'),
    port: optionalNumber('SMTP_PORT', 587),
    user: optional('SMTP_USER', ''),
    pass: optional('SMTP_PASS', ''),
    fromName: optional('SMTP_FROM_NAME', 'CyberShield LMS'),
    fromEmail: optional('SMTP_USER', 'noreply@cybershield.local'),
  },

  frontend: {
    url: optional('FRONTEND_URL', 'http://localhost:3000'),
  },

  session: {
    secret: optional('SESSION_SECRET', 'dev-session-secret-32-chars-long!'),
  },

  uploads: {
    maxSize: optional('MAX_UPLOAD_SIZE', '10mb'),
    maxSizeBytes: optionalNumber('MAX_UPLOAD_SIZE_BYTES', 10 * 1024 * 1024),
    dest: optional('UPLOAD_DEST', 'uploads/'),
  },

  encryption: {
    key: optional('ENCRYPTION_KEY', 'dev-encryption-key-32-chars-long'),
  },

  rateLimit: {
    windowMs: optionalNumber('RATE_LIMIT_WINDOW_MS', 15 * 60 * 1000),
    general: optionalNumber('RATE_LIMIT_GENERAL', 100),
    auth: optionalNumber('RATE_LIMIT_AUTH', 5),
  },

  cors: {
    origins: optional('CORS_ORIGINS', 'http://localhost:3000').split(','),
  },
} as const;

export type Config = typeof config;
