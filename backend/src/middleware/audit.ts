import { Request, Response, NextFunction } from 'express';
import { Pool } from 'pg';
import { pool, query as dbQuery } from '../config/database';
// Pool is used in the function signature for logAuditEvent
void (Pool as unknown); // suppress unused warning
import { logger } from '../utils/logger';
import { v4 as uuidv4 } from 'uuid';
import { AuditLogEntry } from '../types';

// ─── Audit Event Interface ────────────────────────────────────────────────────

export interface AuditEvent {
  userId: string | null;
  action: string;
  resource: string;
  resourceId?: string | null;
  ipAddress?: string | null;
  userAgent?: string | null;
  details?: Record<string, unknown> | null;
}

// ─── Write to DB Utility ──────────────────────────────────────────────────────

export async function logAuditEvent(
  db: Pool | typeof pool,
  event: AuditEvent
): Promise<void> {
  try {
    await db.query(
      `INSERT INTO audit_logs
         (id, user_id, action, resource, resource_id, ip_address, user_agent, details, timestamp)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [
        uuidv4(),
        event.userId,
        event.action,
        event.resource,
        event.resourceId ?? null,
        event.ipAddress ?? null,
        event.userAgent ?? null,
        event.details ? JSON.stringify(event.details) : null,
      ]
    );
  } catch (err) {
    // Never throw from audit logging – just log the failure
    logger.error('Failed to write audit log', {
      error: (err as Error).message,
      event,
    });
  }
}

// ─── Express Middleware Factory ───────────────────────────────────────────────

/**
 * Attach an audit log entry after the response is sent.
 *
 * Usage:
 *   router.delete('/:id', verifyToken, auditLog('delete', 'user'), handler)
 */
export function auditLog(action: string, resource: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const originalJson = res.json.bind(res);

    // Wrap res.json so we can capture the response body
    res.json = function (body: unknown) {
      const result = originalJson(body);

      // Fire-and-forget after response is sent
      setImmediate(async () => {
        try {
          const resourceId =
            (req.params.id as string | undefined) ??
            (body && typeof body === 'object' && 'data' in (body as Record<string, unknown>)
              ? ((body as Record<string, unknown>).data as Record<string, unknown>)?.id as string | undefined
              : undefined) ??
            null;

          await logAuditEvent(pool, {
            userId: req.user?.userId ?? null,
            action,
            resource,
            resourceId: resourceId ?? null,
            ipAddress: getClientIp(req),
            userAgent: req.headers['user-agent'] ?? null,
            details: {
              method: req.method,
              path: req.path,
              statusCode: res.statusCode,
              requestId: req.requestId,
              body: sanitiseBody(req.body),
            },
          });
        } catch {
          // swallow – already handled inside logAuditEvent
        }
      });

      return result;
    };

    next();
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getClientIp(req: Request): string | null {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    return ip?.trim() ?? null;
  }
  return req.socket.remoteAddress ?? null;
}

const SENSITIVE_KEYS = new Set(['password', 'passwordHash', 'token', 'refreshToken', 'newPassword', 'currentPassword', 'secret', 'credit_card']);

function sanitiseBody(body: unknown): unknown {
  if (!body || typeof body !== 'object') return body;

  const sanitised: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(body as Record<string, unknown>)) {
    sanitised[key] = SENSITIVE_KEYS.has(key) ? '[REDACTED]' : value;
  }
  return sanitised;
}

// ─── Retrieve Audit Logs ──────────────────────────────────────────────────────

export interface AuditLogFilter {
  userId?: string;
  action?: string;
  resource?: string;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

export async function getAuditLogs(
  filter: AuditLogFilter
): Promise<{ logs: AuditLogEntry[]; total: number }> {
  const page = filter.page ?? 1;
  const limit = Math.min(filter.limit ?? 50, 200);
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];
  let idx = 1;

  if (filter.userId) {
    conditions.push(`al.user_id = $${idx++}`);
    params.push(filter.userId);
  }
  if (filter.action) {
    conditions.push(`al.action ILIKE $${idx++}`);
    params.push(`%${filter.action}%`);
  }
  if (filter.resource) {
    conditions.push(`al.resource = $${idx++}`);
    params.push(filter.resource);
  }
  if (filter.fromDate) {
    conditions.push(`al.timestamp >= $${idx++}`);
    params.push(filter.fromDate);
  }
  if (filter.toDate) {
    conditions.push(`al.timestamp <= $${idx++}`);
    params.push(filter.toDate);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

  const countRows = await dbQuery<{ count: string }>(
    `SELECT COUNT(*) AS count FROM audit_logs al ${where}`,
    params
  );
  const total = parseInt(countRows[0]?.count ?? '0', 10);

  const logs = await dbQuery<AuditLogEntry>(
    `SELECT
       al.id, al.user_id AS "userId", al.action, al.resource,
       al.resource_id AS "resourceId", al.ip_address AS "ipAddress",
       al.user_agent AS "userAgent", al.details, al.timestamp,
       CONCAT(u.first_name, ' ', u.last_name) AS "userName"
     FROM audit_logs al
     LEFT JOIN users u ON u.id = al.user_id
     ${where}
     ORDER BY al.timestamp DESC
     LIMIT $${idx++} OFFSET $${idx++}`,
    [...params, limit, offset]
  );

  return { logs, total };
}
