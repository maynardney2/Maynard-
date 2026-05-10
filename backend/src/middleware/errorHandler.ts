import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// ─── Custom Error Classes ────────────────────────────────────────────────────

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly code?: string;

  constructor(message: string, statusCode: number, code?: string, isOperational = true) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  public readonly fields?: Record<string, string>;

  constructor(message: string, fields?: Record<string, string>) {
    super(message, 422, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
    this.fields = fields;
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND');
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'FORBIDDEN');
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
    this.name = 'ConflictError';
  }
}

// ─── Postgres Error Codes ────────────────────────────────────────────────────

interface PgError extends Error {
  code?: string;
  constraint?: string;
  detail?: string;
}

function isPgError(err: unknown): err is PgError {
  return err instanceof Error && 'code' in err;
}

// ─── Global Error Handler ────────────────────────────────────────────────────

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  // Operational AppErrors
  if (err instanceof AppError) {
    logger.warn('Operational error', {
      message: err.message,
      statusCode: err.statusCode,
      code: err.code,
      path: req.path,
      requestId: req.requestId,
    });

    const body: Record<string, unknown> = {
      success: false,
      error: err.message,
      code: err.code,
    };

    if (err instanceof ValidationError && err.fields) {
      body.fields = err.fields;
    }

    res.status(err.statusCode).json(body);
    return;
  }

  // Postgres errors
  if (isPgError(err)) {
    if (err.code === '23505') {
      // Unique constraint violation
      res.status(409).json({
        success: false,
        error: 'A record with that value already exists',
        code: 'DUPLICATE_ENTRY',
        detail: err.detail,
      });
      return;
    }

    if (err.code === '23503') {
      // Foreign key violation
      res.status(400).json({
        success: false,
        error: 'Referenced record does not exist',
        code: 'FOREIGN_KEY_VIOLATION',
      });
      return;
    }

    if (err.code === '23502') {
      // Not-null violation
      res.status(400).json({
        success: false,
        error: 'Required field is missing',
        code: 'NULL_VIOLATION',
      });
      return;
    }
  }

  // SyntaxError from JSON body parser
  if (err instanceof SyntaxError && 'status' in err && (err as { status: number }).status === 400) {
    res.status(400).json({
      success: false,
      error: 'Invalid JSON in request body',
      code: 'INVALID_JSON',
    });
    return;
  }

  // Unknown / programming errors
  const error = err instanceof Error ? err : new Error(String(err));
  logger.error('Unhandled error', {
    message: error.message,
    stack: error.stack,
    path: req.path,
    method: req.method,
    requestId: req.requestId,
  });

  res.status(500).json({
    success: false,
    error: 'An unexpected error occurred',
    code: 'INTERNAL_SERVER_ERROR',
    ...(process.env.NODE_ENV !== 'production' && { detail: error.message }),
  });
}
