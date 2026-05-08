import 'dotenv/config';
import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import compression from 'compression';
import { v4 as uuidv4 } from 'uuid';

import { config } from './config';
import { logger } from './utils/logger';
import { testConnection, closePool } from './config/database';
import { errorHandler } from './middleware/errorHandler';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import courseRoutes from './routes/courses';
import adminRoutes from './routes/admin';
import reportRoutes from './routes/reports';
import notificationRoutes from './routes/notifications';

// ─── App Initialisation ──────────────────────────────────────────────────────

const app: Application = express();

// ─── Security Headers ─────────────────────────────────────────────────────────

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        scriptSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// ─── CORS ─────────────────────────────────────────────────────────────────────

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser clients
      if (config.cors.origins.includes(origin)) return callback(null, true);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
    exposedHeaders: ['X-Request-ID', 'X-Total-Count'],
  })
);

// ─── Rate Limiters ────────────────────────────────────────────────────────────

const generalLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.general,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
  skip: (req) => config.isDevelopment && req.ip === '127.0.0.1',
});

const authLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.auth,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many authentication attempts, please try again later.' },
  skip: () => config.isDevelopment,
});

// ─── Request Logging ──────────────────────────────────────────────────────────

app.use(
  morgan('combined', {
    stream: { write: (msg: string) => logger.http(msg.trim()) },
    skip: (req) => req.url === '/health',
  })
);

// ─── Request ID ───────────────────────────────────────────────────────────────

app.use((req: Request, res: Response, next: NextFunction) => {
  const requestId = (req.headers['x-request-id'] as string) || uuidv4();
  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

// ─── Body Parsing & Compression ───────────────────────────────────────────────

app.use(compression());
app.use(express.json({ limit: config.uploads.maxSize }));
app.use(express.urlencoded({ extended: true, limit: config.uploads.maxSize }));

// ─── Health Check ─────────────────────────────────────────────────────────────

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'cybershield-api',
    version: process.env.npm_package_version ?? '1.0.0',
    timestamp: new Date().toISOString(),
    environment: config.env,
  });
});

// ─── API Routes ───────────────────────────────────────────────────────────────

app.use('/api/v1/auth', authLimiter, authRoutes);
app.use('/api/v1/users', generalLimiter, userRoutes);
app.use('/api/v1/courses', generalLimiter, courseRoutes);
app.use('/api/v1/admin', generalLimiter, adminRoutes);
app.use('/api/v1/reports', generalLimiter, reportRoutes);
app.use('/api/v1/notifications', generalLimiter, notificationRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────

app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────

app.use(errorHandler);

// ─── Server Startup ───────────────────────────────────────────────────────────

async function bootstrap(): Promise<void> {
  await testConnection();

  const server = app.listen(config.port, () => {
    logger.info(`CyberShield API listening`, {
      port: config.port,
      env: config.env,
      pid: process.pid,
    });
  });

  // ─── Graceful Shutdown ────────────────────────────────────────────────────

  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`Received ${signal}. Starting graceful shutdown…`);

    server.close(async () => {
      logger.info('HTTP server closed. Draining database pool…');
      await closePool();
      logger.info('Shutdown complete.');
      process.exit(0);
    });

    // Force-kill after 10 s
    setTimeout(() => {
      logger.error('Graceful shutdown timed out — forcing exit.');
      process.exit(1);
    }, 10_000).unref();
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught exception', { error: error.message, stack: error.stack });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled promise rejection', { reason });
    process.exit(1);
  });
}

bootstrap().catch((err: Error) => {
  logger.error('Failed to start server', { error: err.message });
  process.exit(1);
});

export default app;
