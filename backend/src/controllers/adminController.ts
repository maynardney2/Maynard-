import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database';
import { AppError, NotFoundError, ConflictError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import { getAuditLogs } from '../middleware/audit';
import {
  User, CreateUserRequest, UpdateUserRequest,
  CreateCourseRequest, CourseAssignmentRequest,
  Course, PaginatedResponse,
} from '../types';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function camelToUser(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    email: row.email as string,
    firstName: (row.first_name ?? row.firstName) as string,
    lastName: (row.last_name ?? row.lastName) as string,
    role: row.role as User['role'],
    department: row.department as string,
    jobTitle: (row.job_title ?? row.jobTitle) as string,
    managerId: (row.manager_id ?? row.managerId) as string | null,
    avatarUrl: (row.avatar_url ?? row.avatarUrl) as string | null,
    isActive: (row.is_active ?? row.isActive) as boolean,
    lastLogin: (row.last_login ?? row.lastLogin) as Date | null,
    createdAt: (row.created_at ?? row.createdAt) as Date,
    updatedAt: (row.updated_at ?? row.updatedAt) as Date,
    microsoftId: (row.microsoft_id ?? row.microsoftId) as string | null,
    phoneNumber: (row.phone_number ?? row.phoneNumber) as string | null,
    riskScore: (row.risk_score ?? row.riskScore) as number,
  };
}

// ─── User Management ──────────────────────────────────────────────────────────

export async function listUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      page = '1', limit = '20', search, department, role, isActive,
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, parseInt(limit, 10) || 20);
    const offset = (pageNum - 1) * limitNum;

    const conditions: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    if (search) {
      conditions.push(
        `(email ILIKE $${idx} OR first_name ILIKE $${idx} OR last_name ILIKE $${idx})`
      );
      params.push(`%${search}%`);
      idx++;
    }
    if (department) { conditions.push(`department = $${idx++}`); params.push(department); }
    if (role) { conditions.push(`role = $${idx++}`); params.push(role); }
    if (isActive !== undefined) {
      conditions.push(`is_active = $${idx++}`);
      params.push(isActive === 'true');
    }

    const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

    let users: User[];
    let total: number;

    try {
      const countResult = await query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM users ${where}`, params
      );
      total = parseInt(countResult[0]?.count ?? '0', 10);

      const rows = await query<Record<string, unknown>>(
        `SELECT id, email, first_name, last_name, role, department, job_title,
                manager_id, avatar_url, is_active, last_login, created_at, updated_at,
                microsoft_id, phone_number, risk_score
         FROM users ${where}
         ORDER BY created_at DESC
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...params, limitNum, offset]
      );
      users = rows.map(camelToUser);
    } catch {
      // Mock fallback
      users = [
        {
          id: 'usr-001', email: 'admin@cybershield.local', firstName: 'Alice', lastName: 'Admin',
          role: 'admin', department: 'IT Security', jobTitle: 'Security Administrator',
          managerId: null, avatarUrl: null, isActive: true, lastLogin: null,
          createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01'),
          microsoftId: null, phoneNumber: null, riskScore: 5,
        },
        {
          id: 'usr-002', email: 'manager@cybershield.local', firstName: 'Bob', lastName: 'Manager',
          role: 'manager', department: 'Engineering', jobTitle: 'Engineering Manager',
          managerId: null, avatarUrl: null, isActive: true, lastLogin: null,
          createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01'),
          microsoftId: null, phoneNumber: null, riskScore: 15,
        },
        {
          id: 'usr-003', email: 'employee@cybershield.local', firstName: 'Carol', lastName: 'Employee',
          role: 'employee', department: 'Engineering', jobTitle: 'Software Engineer',
          managerId: 'usr-002', avatarUrl: null, isActive: true, lastLogin: null,
          createdAt: new Date('2024-01-01'), updatedAt: new Date('2024-01-01'),
          microsoftId: null, phoneNumber: null, riskScore: 25,
        },
      ];
      total = users.length;
    }

    const response: PaginatedResponse<User> = {
      data: users,
      pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
    };

    res.json({ success: true, ...response });
  } catch (err) {
    next(err);
  }
}

export async function createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body: CreateUserRequest = req.body;

    const required = ['email', 'firstName', 'lastName', 'role', 'department', 'jobTitle'] as const;
    for (const field of required) {
      if (!body[field]) throw new AppError(`${field} is required`, 400, 'MISSING_FIELD');
    }

    const passwordHash = body.password
      ? await bcrypt.hash(body.password, 12)
      : null;

    let user: User;
    try {
      const existing = await queryOne('SELECT id FROM users WHERE email = $1', [body.email.toLowerCase()]);
      if (existing) throw new ConflictError('A user with that email already exists');

      const rows = await query<Record<string, unknown>>(
        `INSERT INTO users
           (id, email, first_name, last_name, role, department, job_title,
            manager_id, phone_number, password_hash, is_active, risk_score, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true, 50, NOW(), NOW())
         RETURNING id, email, first_name, last_name, role, department, job_title,
                   manager_id, avatar_url, is_active, last_login, created_at, updated_at,
                   microsoft_id, phone_number, risk_score`,
        [
          uuidv4(), body.email.toLowerCase(), body.firstName, body.lastName,
          body.role, body.department, body.jobTitle,
          body.managerId ?? null, body.phoneNumber ?? null, passwordHash,
        ]
      );
      user = camelToUser(rows[0] as Record<string, unknown>);
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('Database unavailable — cannot create user in demo mode', 503, 'DB_OFFLINE');
    }

    logger.info('Admin created user', { adminId: req.user?.userId, newUserId: user.id });
    res.status(201).json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const body: UpdateUserRequest = req.body;

    const setClauses: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    const fieldMap: Record<keyof UpdateUserRequest, string> = {
      firstName: 'first_name',
      lastName: 'last_name',
      role: 'role',
      department: 'department',
      jobTitle: 'job_title',
      managerId: 'manager_id',
      phoneNumber: 'phone_number',
      isActive: 'is_active',
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (body[key as keyof UpdateUserRequest] !== undefined) {
        setClauses.push(`${col} = $${idx++}`);
        params.push(body[key as keyof UpdateUserRequest]);
      }
    }

    if (setClauses.length === 0) {
      throw new AppError('No fields to update', 400, 'NO_UPDATES');
    }

    setClauses.push(`updated_at = NOW()`);
    params.push(id);

    let user: User;
    try {
      const rows = await query<Record<string, unknown>>(
        `UPDATE users SET ${setClauses.join(', ')}
         WHERE id = $${idx}
         RETURNING id, email, first_name, last_name, role, department, job_title,
                   manager_id, avatar_url, is_active, last_login, created_at, updated_at,
                   microsoft_id, phone_number, risk_score`,
        params
      );
      if (!rows[0]) throw new NotFoundError('User');
      user = camelToUser(rows[0] as Record<string, unknown>);
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('Database unavailable', 503, 'DB_OFFLINE');
    }

    logger.info('Admin updated user', { adminId: req.user?.userId, targetUserId: id });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    if (id === req.user?.userId) {
      throw new AppError('You cannot delete your own account', 400, 'SELF_DELETE');
    }

    try {
      const result = await query('UPDATE users SET is_active = false WHERE id = $1', [id]);
      if ((result as unknown as { rowCount: number }).rowCount === 0) {
        throw new NotFoundError('User');
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('Database unavailable', 503, 'DB_OFFLINE');
    }

    logger.info('Admin deactivated user', { adminId: req.user?.userId, targetUserId: id });
    res.json({ success: true, message: 'User deactivated successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getUserActivity(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    let activity: unknown[] = [];
    try {
      activity = await query(
        `SELECT al.id, al.action, al.resource, al.resource_id AS "resourceId",
                al.timestamp, al.ip_address AS "ipAddress", al.details
         FROM audit_logs al
         WHERE al.user_id = $1
         ORDER BY al.timestamp DESC
         LIMIT 50`,
        [id]
      );
    } catch {
      activity = [];
    }

    res.json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
}

// ─── Course Management ────────────────────────────────────────────────────────

export async function adminCreateCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body: CreateCourseRequest = req.body;
    const adminId = req.user!.userId;

    const required = ['title', 'description', 'category', 'difficulty', 'estimatedMinutes', 'passingScore'] as const;
    for (const field of required) {
      if (body[field] === undefined || body[field] === null || body[field] === '') {
        throw new AppError(`${field} is required`, 400, 'MISSING_FIELD');
      }
    }

    let course: Course;
    try {
      const courseId = uuidv4();
      const rows = await query<Record<string, unknown>>(
        `INSERT INTO courses
           (id, title, description, category, difficulty, estimated_minutes, passing_score,
            tags, is_required, status, created_by, created_at, updated_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'draft', $10, NOW(), NOW())
         RETURNING id, title, description, category, difficulty,
                   estimated_minutes AS "estimatedMinutes", thumbnail_url AS "thumbnailUrl",
                   status, passing_score AS "passingScore", created_by AS "createdBy",
                   created_at AS "createdAt", updated_at AS "updatedAt",
                   tags, is_required AS "isRequired", due_date AS "dueDate"`,
        [
          courseId, body.title, body.description, body.category, body.difficulty,
          body.estimatedMinutes, body.passingScore,
          body.tags ?? [], body.isRequired ?? false, adminId,
        ]
      );
      course = rows[0] as unknown as Course;

      // Insert modules if provided
      if (body.modules?.length) {
        for (const mod of body.modules) {
          await query(
            `INSERT INTO course_modules
               (id, course_id, title, description, order_index, content_type,
                content_url, content_html, estimated_minutes, created_at, updated_at)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
            [
              uuidv4(), courseId, mod.title, mod.description, mod.orderIndex,
              mod.contentType, mod.contentUrl, mod.contentHtml, mod.estimatedMinutes,
            ]
          );
        }
      }
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('Database unavailable', 503, 'DB_OFFLINE');
    }

    logger.info('Admin created course', { adminId, courseId: course.id });
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
}

export async function adminUpdateCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const body = req.body as Partial<CreateCourseRequest & { status: string }>;

    const setClauses: string[] = [];
    const params: unknown[] = [];
    let idx = 1;

    const fieldMap: Record<string, string> = {
      title: 'title', description: 'description', category: 'category',
      difficulty: 'difficulty', estimatedMinutes: 'estimated_minutes',
      passingScore: 'passing_score', tags: 'tags', isRequired: 'is_required',
      status: 'status',
    };

    for (const [key, col] of Object.entries(fieldMap)) {
      if (body[key as keyof typeof body] !== undefined) {
        setClauses.push(`${col} = $${idx++}`);
        params.push(body[key as keyof typeof body]);
      }
    }

    if (setClauses.length === 0) throw new AppError('No fields to update', 400, 'NO_UPDATES');
    setClauses.push('updated_at = NOW()');
    params.push(id);

    let course: Course;
    try {
      const rows = await query<Record<string, unknown>>(
        `UPDATE courses SET ${setClauses.join(', ')}
         WHERE id = $${idx}
         RETURNING id, title, description, category, difficulty,
                   estimated_minutes AS "estimatedMinutes", thumbnail_url AS "thumbnailUrl",
                   status, passing_score AS "passingScore", created_by AS "createdBy",
                   created_at AS "createdAt", updated_at AS "updatedAt",
                   tags, is_required AS "isRequired", due_date AS "dueDate"`,
        params
      );
      if (!rows[0]) throw new NotFoundError('Course');
      course = rows[0] as unknown as Course;
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('Database unavailable', 503, 'DB_OFFLINE');
    }

    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
}

export async function adminDeleteCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    try {
      await query("UPDATE courses SET status = 'archived' WHERE id = $1", [id]);
    } catch (err) {
      if (err instanceof AppError) throw err;
      throw new AppError('Database unavailable', 503, 'DB_OFFLINE');
    }
    res.json({ success: true, message: 'Course archived successfully' });
  } catch (err) {
    next(err);
  }
}

// ─── Course Assignments ───────────────────────────────────────────────────────

export async function assignCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const body: CourseAssignmentRequest = req.body;
    const adminId = req.user!.userId;

    if (!body.courseId) throw new AppError('courseId is required', 400, 'MISSING_FIELD');
    if (!body.userIds?.length && !body.departments?.length) {
      throw new AppError('At least one of userIds or departments is required', 400, 'NO_TARGETS');
    }

    let targetUserIds: string[] = body.userIds ?? [];

    try {
      // Fetch users by department if specified
      if (body.departments?.length) {
        const placeholders = body.departments.map((_, i) => `$${i + 1}`).join(', ');
        const depUsers = await query<{ id: string }>(
          `SELECT id FROM users WHERE department = ANY(ARRAY[${placeholders}]) AND is_active = true`,
          body.departments
        );
        const depUserIds = depUsers.map(u => u.id);
        targetUserIds = [...new Set([...targetUserIds, ...depUserIds])];
      }

      let enrolled = 0;
      for (const userId of targetUserIds) {
        try {
          await query(
            `INSERT INTO enrollments
               (id, user_id, course_id, status, enrolled_at, due_date, assigned_by, progress_percent)
             VALUES ($1, $2, $3, 'enrolled', NOW(), $4, $5, 0)
             ON CONFLICT (user_id, course_id) DO NOTHING`,
            [uuidv4(), userId, body.courseId, body.dueDate ?? null, adminId]
          );
          enrolled++;
        } catch { /* skip individual failures */ }
      }

      logger.info('Courses assigned', { adminId, courseId: body.courseId, enrolled });
      res.json({ success: true, data: { assigned: enrolled, courseId: body.courseId } });
    } catch (err) {
      if (err instanceof AppError) throw err;
      // Demo fallback
      res.json({
        success: true,
        data: {
          assigned: targetUserIds.length,
          courseId: body.courseId,
          note: 'Demo mode — no database available',
        },
      });
    }
  } catch (err) {
    next(err);
  }
}

// ─── Audit Logs ───────────────────────────────────────────────────────────────

export async function getAuditLogEntries(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const {
      userId, action, resource, fromDate, toDate,
      page = '1', limit = '50',
    } = req.query as Record<string, string>;

    const result = await getAuditLogs({
      userId,
      action,
      resource,
      fromDate: fromDate ? new Date(fromDate) : undefined,
      toDate: toDate ? new Date(toDate) : undefined,
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
    });

    res.json({
      success: true,
      data: result.logs,
      pagination: {
        total: result.total,
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        totalPages: Math.ceil(result.total / parseInt(limit, 10)),
      },
    });
  } catch (err) {
    next(err);
  }
}
