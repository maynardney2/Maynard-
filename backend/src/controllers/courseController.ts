import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { query, queryOne } from '../config/database';
import { AppError, NotFoundError } from '../middleware/errorHandler';
import { logger } from '../utils/logger';
import {
  Course, CourseModule, Quiz, QuizSubmission, QuizResult,
  Enrollment, UpdateProgressRequest, PaginatedResponse,
} from '../types';

// ─── Mock Data (DB fallback) ─────────────────────────────────────────────────

const MOCK_COURSES: Course[] = [
  {
    id: 'crs-001',
    title: 'Phishing Awareness Fundamentals',
    description: 'Learn to identify and report phishing attacks before they cause harm.',
    category: 'phishing',
    difficulty: 'beginner',
    estimatedMinutes: 30,
    thumbnailUrl: null,
    status: 'published',
    passingScore: 80,
    createdBy: 'usr-001',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    moduleCount: 4,
    enrolledCount: 120,
    completionRate: 85,
    tags: ['phishing', 'email', 'social engineering'],
    isRequired: true,
    dueDate: null,
  },
  {
    id: 'crs-002',
    title: 'Password Security Best Practices',
    description: 'Master secure password creation, management, and multi-factor authentication.',
    category: 'password_security',
    difficulty: 'beginner',
    estimatedMinutes: 20,
    thumbnailUrl: null,
    status: 'published',
    passingScore: 75,
    createdBy: 'usr-001',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
    moduleCount: 3,
    enrolledCount: 150,
    completionRate: 90,
    tags: ['passwords', 'MFA', '2FA'],
    isRequired: true,
    dueDate: null,
  },
  {
    id: 'crs-003',
    title: 'Data Privacy & GDPR Compliance',
    description: 'Understand data privacy regulations and your responsibilities under GDPR.',
    category: 'data_privacy',
    difficulty: 'intermediate',
    estimatedMinutes: 45,
    thumbnailUrl: null,
    status: 'published',
    passingScore: 80,
    createdBy: 'usr-001',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
    moduleCount: 5,
    enrolledCount: 90,
    completionRate: 70,
    tags: ['GDPR', 'compliance', 'data privacy'],
    isRequired: true,
    dueDate: null,
  },
  {
    id: 'crs-004',
    title: 'Ransomware & Malware Defence',
    description: 'Detect, prevent, and respond to malware and ransomware threats.',
    category: 'malware_awareness',
    difficulty: 'intermediate',
    estimatedMinutes: 40,
    thumbnailUrl: null,
    status: 'published',
    passingScore: 75,
    createdBy: 'usr-001',
    createdAt: new Date('2024-02-10'),
    updatedAt: new Date('2024-02-10'),
    moduleCount: 4,
    enrolledCount: 80,
    completionRate: 65,
    tags: ['malware', 'ransomware', 'endpoint security'],
    isRequired: false,
    dueDate: null,
  },
  {
    id: 'crs-005',
    title: 'Incident Response Essentials',
    description: 'Know what to do when a security incident occurs in your organisation.',
    category: 'incident_response',
    difficulty: 'advanced',
    estimatedMinutes: 60,
    thumbnailUrl: null,
    status: 'published',
    passingScore: 85,
    createdBy: 'usr-001',
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-01'),
    moduleCount: 6,
    enrolledCount: 45,
    completionRate: 55,
    tags: ['incident response', 'IR plan', 'forensics'],
    isRequired: false,
    dueDate: null,
  },
];

const MOCK_MODULES: Record<string, CourseModule[]> = {
  'crs-001': [
    {
      id: 'mod-001-1', courseId: 'crs-001', title: 'What Is Phishing?',
      description: 'Introduction to phishing attacks and common vectors.',
      orderIndex: 1, contentType: 'video', contentUrl: 'https://example.com/videos/phishing-intro',
      contentHtml: null, estimatedMinutes: 8, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      id: 'mod-001-2', courseId: 'crs-001', title: 'Identifying Red Flags',
      description: 'Visual cues and language patterns to watch for.',
      orderIndex: 2, contentType: 'interactive', contentUrl: null,
      contentHtml: '<h2>Red Flags</h2><p>Look for urgency, spelling errors, and suspicious links.</p>',
      estimatedMinutes: 10, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      id: 'mod-001-3', courseId: 'crs-001', title: 'Reporting Phishing',
      description: 'Step-by-step guide to reporting suspicious emails.',
      orderIndex: 3, contentType: 'text', contentUrl: null,
      contentHtml: '<h2>How to Report</h2><p>Use the "Report Phishing" button in your email client.</p>',
      estimatedMinutes: 5, createdAt: new Date(), updatedAt: new Date(),
    },
    {
      id: 'mod-001-4', courseId: 'crs-001', title: 'Module Quiz',
      description: 'Test your phishing awareness knowledge.',
      orderIndex: 4, contentType: 'quiz', contentUrl: null, contentHtml: null,
      estimatedMinutes: 7, createdAt: new Date(), updatedAt: new Date(),
    },
  ],
};

const MOCK_QUIZZES: Record<string, Quiz> = {
  'crs-001': {
    id: 'qz-001',
    courseId: 'crs-001',
    title: 'Phishing Awareness Assessment',
    passingScore: 80,
    maxAttempts: 3,
    timeLimitMinutes: 15,
    questions: [
      {
        id: 'q-001', quizId: 'qz-001',
        questionText: 'Which of the following is a common sign of a phishing email?',
        questionType: 'multiple_choice', orderIndex: 1, points: 25,
        options: [
          { id: 'opt-1a', text: 'The sender is from your company\'s official domain', isCorrect: false },
          { id: 'opt-1b', text: 'Urgent request to click a link and verify your credentials', isCorrect: true },
          { id: 'opt-1c', text: 'The email has proper grammar and no spelling mistakes', isCorrect: false },
          { id: 'opt-1d', text: 'The email was expected and you recognise the sender', isCorrect: false },
        ],
      },
      {
        id: 'q-002', quizId: 'qz-001',
        questionText: 'You receive an email from "security@micros0ft.com" asking you to reset your password. What should you do?',
        questionType: 'multiple_choice', orderIndex: 2, points: 25,
        options: [
          { id: 'opt-2a', text: 'Click the link immediately — your account may be compromised', isCorrect: false },
          { id: 'opt-2b', text: 'Reply to ask if it is legitimate', isCorrect: false },
          { id: 'opt-2c', text: 'Report it as phishing and delete it without clicking', isCorrect: true },
          { id: 'opt-2d', text: 'Forward it to colleagues to warn them', isCorrect: false },
        ],
      },
      {
        id: 'q-003', quizId: 'qz-001',
        questionText: 'Spear phishing attacks are targeted at specific individuals or organisations.',
        questionType: 'true_false', orderIndex: 3, points: 25,
        options: [
          { id: 'opt-3a', text: 'True', isCorrect: true },
          { id: 'opt-3b', text: 'False', isCorrect: false },
        ],
      },
      {
        id: 'q-004', quizId: 'qz-001',
        questionText: 'Which of the following are safe actions when you suspect phishing? (Select all that apply)',
        questionType: 'multi_select', orderIndex: 4, points: 25,
        options: [
          { id: 'opt-4a', text: 'Report via the phishing button in your email client', isCorrect: true },
          { id: 'opt-4b', text: 'Click the link to check where it leads', isCorrect: false },
          { id: 'opt-4c', text: 'Contact your IT Security team', isCorrect: true },
          { id: 'opt-4d', text: 'Delete the email without clicking', isCorrect: true },
        ],
      },
    ],
  },
};

// ─── List Courses ─────────────────────────────────────────────────────────────

export async function listCourses(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { category, difficulty, search, page = '1', limit = '20' } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page, 10));
    const limitNum = Math.min(100, parseInt(limit, 10) || 20);
    const offset = (pageNum - 1) * limitNum;

    let courses: Course[];
    let total: number;

    try {
      const conditions: string[] = ["status = 'published'"];
      const params: unknown[] = [];
      let idx = 1;

      if (category) { conditions.push(`category = $${idx++}`); params.push(category); }
      if (difficulty) { conditions.push(`difficulty = $${idx++}`); params.push(difficulty); }
      if (search) {
        conditions.push(`(title ILIKE $${idx} OR description ILIKE $${idx})`);
        params.push(`%${search}%`);
        idx++;
      }

      const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

      const countResult = await query<{ count: string }>(
        `SELECT COUNT(*) AS count FROM courses ${where}`, params
      );
      total = parseInt(countResult[0]?.count ?? '0', 10);

      courses = await query<Course>(
        `SELECT
           id, title, description, category, difficulty, estimated_minutes AS "estimatedMinutes",
           thumbnail_url AS "thumbnailUrl", status, passing_score AS "passingScore",
           created_by AS "createdBy", created_at AS "createdAt", updated_at AS "updatedAt",
           tags, is_required AS "isRequired", due_date AS "dueDate",
           (SELECT COUNT(*) FROM course_modules WHERE course_id = courses.id) AS "moduleCount",
           (SELECT COUNT(*) FROM enrollments WHERE course_id = courses.id) AS "enrolledCount"
         FROM courses ${where}
         ORDER BY created_at DESC
         LIMIT $${idx++} OFFSET $${idx++}`,
        [...params, limitNum, offset]
      );
    } catch {
      // Mock fallback
      let filtered = MOCK_COURSES.filter(c => c.status === 'published');
      if (category) filtered = filtered.filter(c => c.category === category);
      if (difficulty) filtered = filtered.filter(c => c.difficulty === difficulty);
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter(c =>
          c.title.toLowerCase().includes(s) || c.description.toLowerCase().includes(s)
        );
      }
      total = filtered.length;
      courses = filtered.slice(offset, offset + limitNum);
    }

    const response: PaginatedResponse<Course> = {
      data: courses,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    };

    res.json({ success: true, ...response });
  } catch (err) {
    next(err);
  }
}

// ─── Get Course ───────────────────────────────────────────────────────────────

export async function getCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    let course: Course | null = null;
    try {
      course = await queryOne<Course>(
        `SELECT
           id, title, description, category, difficulty, estimated_minutes AS "estimatedMinutes",
           thumbnail_url AS "thumbnailUrl", status, passing_score AS "passingScore",
           created_by AS "createdBy", created_at AS "createdAt", updated_at AS "updatedAt",
           tags, is_required AS "isRequired", due_date AS "dueDate",
           (SELECT COUNT(*) FROM course_modules WHERE course_id = courses.id) AS "moduleCount",
           (SELECT COUNT(*) FROM enrollments WHERE course_id = courses.id) AS "enrolledCount"
         FROM courses WHERE id = $1`,
        [id]
      );
    } catch {
      course = MOCK_COURSES.find(c => c.id === id) ?? null;
    }

    if (!course) throw new NotFoundError('Course');

    // Attach enrollment info for the requesting user
    if (req.user) {
      try {
        const enrollment = await queryOne<Enrollment>(
          `SELECT id, status, progress_percent AS "progressPercent", quiz_score AS "quizScore",
                  enrolled_at AS "enrolledAt", completed_at AS "completedAt", due_date AS "dueDate"
           FROM enrollments WHERE user_id = $1 AND course_id = $2`,
          [req.user.userId, id]
        );
        if (enrollment) {
          (course as Course & { enrollment: Enrollment }).enrollment = enrollment;
        }
      } catch { /* non-critical */ }
    }

    res.json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
}

// ─── Get Course Modules ───────────────────────────────────────────────────────

export async function getCourseModules(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    let modules: CourseModule[];
    try {
      modules = await query<CourseModule>(
        `SELECT
           id, course_id AS "courseId", title, description, order_index AS "orderIndex",
           content_type AS "contentType", content_url AS "contentUrl",
           content_html AS "contentHtml", estimated_minutes AS "estimatedMinutes",
           created_at AS "createdAt", updated_at AS "updatedAt"
         FROM course_modules WHERE course_id = $1 ORDER BY order_index`,
        [id]
      );
    } catch {
      modules = MOCK_MODULES[id] ?? [];
    }

    res.json({ success: true, data: modules });
  } catch (err) {
    next(err);
  }
}

// ─── Enroll ───────────────────────────────────────────────────────────────────

export async function enrollInCourse(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id: courseId } = req.params;
    const userId = req.user!.userId;

    let enrollment: Enrollment | null = null;
    try {
      // Check existing
      const existing = await queryOne<Enrollment>(
        'SELECT id FROM enrollments WHERE user_id = $1 AND course_id = $2',
        [userId, courseId]
      );
      if (existing) {
        throw new AppError('Already enrolled in this course', 409, 'ALREADY_ENROLLED');
      }

      const rows = await query<Enrollment>(
        `INSERT INTO enrollments
           (id, user_id, course_id, status, enrolled_at, progress_percent)
         VALUES ($1, $2, $3, 'enrolled', NOW(), 0)
         RETURNING
           id, user_id AS "userId", course_id AS "courseId", status,
           enrolled_at AS "enrolledAt", started_at AS "startedAt",
           completed_at AS "completedAt", due_date AS "dueDate",
           progress_percent AS "progressPercent", quiz_score AS "quizScore",
           assigned_by AS "assignedBy"`,
        [uuidv4(), userId, courseId]
      );
      enrollment = rows[0] ?? null;
    } catch (err) {
      if (err instanceof AppError) throw err;
      // Mock fallback
      enrollment = {
        id: uuidv4(),
        userId,
        courseId,
        status: 'enrolled',
        enrolledAt: new Date(),
        startedAt: null,
        completedAt: null,
        dueDate: null,
        progressPercent: 0,
        quizScore: null,
        assignedBy: null,
      };
    }

    logger.info('User enrolled in course', { userId, courseId });

    res.status(201).json({ success: true, data: enrollment });
  } catch (err) {
    next(err);
  }
}

// ─── Update Progress ──────────────────────────────────────────────────────────

export async function updateProgress(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id: courseId } = req.params;
    const userId = req.user!.userId;
    const { moduleId, completed, timeSpentSeconds }: UpdateProgressRequest = req.body;

    let result: { progressPercent: number; status: string } = { progressPercent: 0, status: 'in_progress' };

    try {
      // Upsert module progress
      await query(
        `INSERT INTO module_progress
           (id, enrollment_id, module_id, completed, completed_at, time_spent_seconds)
         SELECT $1, e.id, $2, $3, $4, $5
         FROM enrollments e
         WHERE e.user_id = $6 AND e.course_id = $7
         ON CONFLICT (enrollment_id, module_id) DO UPDATE
           SET completed = EXCLUDED.completed,
               completed_at = EXCLUDED.completed_at,
               time_spent_seconds = module_progress.time_spent_seconds + EXCLUDED.time_spent_seconds`,
        [
          uuidv4(), moduleId, completed,
          completed ? new Date() : null,
          timeSpentSeconds ?? 0, userId, courseId,
        ]
      );

      // Recalculate progress
      const progressRow = await queryOne<{ progressPercent: number; totalModules: number }>(
        `SELECT
           ROUND(
             100.0 * COUNT(*) FILTER (WHERE mp.completed) /
             NULLIF(COUNT(cm.id), 0)
           ) AS "progressPercent",
           COUNT(cm.id) AS "totalModules"
         FROM course_modules cm
         LEFT JOIN enrollments e ON e.course_id = cm.course_id AND e.user_id = $1
         LEFT JOIN module_progress mp ON mp.module_id = cm.id AND mp.enrollment_id = e.id
         WHERE cm.course_id = $2`,
        [userId, courseId]
      );

      const pct = progressRow?.progressPercent ?? 0;
      const status = pct >= 100 ? 'completed' : 'in_progress';

      await query(
        `UPDATE enrollments
         SET status = $1, progress_percent = $2,
             started_at = COALESCE(started_at, NOW()),
             completed_at = CASE WHEN $1 = 'completed' THEN NOW() ELSE completed_at END,
             updated_at = NOW()
         WHERE user_id = $3 AND course_id = $4`,
        [status, pct, userId, courseId]
      );

      result = { progressPercent: pct, status };
    } catch (err) {
      if (err instanceof AppError) throw err;
      // Mock: just return 50% for demo
      result = { progressPercent: 50, status: 'in_progress' };
    }

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

// ─── Get Quiz ─────────────────────────────────────────────────────────────────

export async function getCourseQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id: courseId } = req.params;

    let quiz: Quiz | null = null;
    try {
      const quizRow = await queryOne<Quiz>(
        `SELECT id, course_id AS "courseId", title, passing_score AS "passingScore",
                max_attempts AS "maxAttempts", time_limit_minutes AS "timeLimitMinutes"
         FROM quizzes WHERE course_id = $1`,
        [courseId]
      );

      if (quizRow) {
        const questions = await query<{ id: string; quizId: string; questionText: string; questionType: string; orderIndex: number; points: number; options: unknown }>(
          `SELECT q.id, q.quiz_id AS "quizId", q.question_text AS "questionText",
                  q.question_type AS "questionType", q.order_index AS "orderIndex",
                  q.points,
                  json_agg(json_build_object(
                    'id', o.id, 'text', o.text
                  ) ORDER BY o.order_index) AS options
           FROM quiz_questions q
           JOIN quiz_options o ON o.question_id = q.id
           WHERE q.quiz_id = $1
           GROUP BY q.id, q.quiz_id, q.question_text, q.question_type, q.order_index, q.points
           ORDER BY q.order_index`,
          [quizRow.id]
        );
        quiz = { ...quizRow, questions: questions as Quiz['questions'] };
      }
    } catch {
      quiz = MOCK_QUIZZES[courseId] ?? null;
      // Strip isCorrect from options before sending to student
      if (quiz) {
        quiz = {
          ...quiz,
          questions: quiz.questions.map(q => ({
            ...q,
            options: q.options.map(o => ({ id: o.id, text: o.text })),
          })),
        };
      }
    }

    if (!quiz) throw new NotFoundError('Quiz');

    res.json({ success: true, data: quiz });
  } catch (err) {
    next(err);
  }
}

// ─── Submit Quiz ──────────────────────────────────────────────────────────────

export async function submitQuiz(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id: courseId } = req.params;
    const userId = req.user!.userId;
    const submission: QuizSubmission = req.body;

    if (!submission.quizId || !Array.isArray(submission.answers)) {
      throw new AppError('quizId and answers are required', 400, 'INVALID_SUBMISSION');
    }

    // Get quiz with correct answers
    let quiz = MOCK_QUIZZES[courseId];
    let usingMock = true;

    try {
      const quizRow = await queryOne<Quiz>(
        `SELECT id, course_id AS "courseId", title, passing_score AS "passingScore",
                max_attempts AS "maxAttempts", time_limit_minutes AS "timeLimitMinutes"
         FROM quizzes WHERE id = $1 AND course_id = $2`,
        [submission.quizId, courseId]
      );

      if (quizRow) {
        const questions = await query<Quiz['questions'][0]>(
          `SELECT q.id, q.quiz_id AS "quizId", q.question_text AS "questionText",
                  q.question_type AS "questionType", q.order_index AS "orderIndex",
                  q.points,
                  json_agg(json_build_object(
                    'id', o.id, 'text', o.option_text, 'isCorrect', o.is_correct
                  ) ORDER BY o.order_index) AS options
           FROM quiz_questions q
           JOIN quiz_options o ON o.question_id = q.id
           WHERE q.quiz_id = $1
           GROUP BY q.id ORDER BY q.order_index`,
          [quizRow.id]
        );
        quiz = { ...quizRow, questions };
        usingMock = false;
      }
    } catch { /* fall through to mock */ }

    if (!quiz) throw new NotFoundError('Quiz');

    // Check attempt count
    let attemptNumber = 1;
    if (!usingMock) {
      try {
        const attRow = await queryOne<{ count: string }>(
          'SELECT COUNT(*) AS count FROM quiz_submissions WHERE user_id = $1 AND quiz_id = $2',
          [userId, submission.quizId]
        );
        attemptNumber = parseInt(attRow?.count ?? '0', 10) + 1;

        if (attemptNumber > quiz.maxAttempts) {
          throw new AppError(
            `Maximum attempts (${quiz.maxAttempts}) reached for this quiz`,
            403, 'MAX_ATTEMPTS_REACHED'
          );
        }
      } catch (err) {
        if (err instanceof AppError) throw err;
      }
    }

    // Score the submission
    let totalPoints = 0;
    let earnedPoints = 0;
    const answerResults: QuizResult['answers'] = [];

    for (const question of quiz.questions) {
      totalPoints += question.points;
      const submitted = submission.answers.find(a => a.questionId === question.id);
      const selectedIds = new Set(submitted?.selectedOptionIds ?? []);
      const correctIds = new Set(question.options.filter(o => o.isCorrect).map(o => o.id));

      let correct = false;
      if (question.questionType === 'multiple_choice' || question.questionType === 'true_false') {
        const selectedArr = [...selectedIds];
        correct = selectedArr.length === 1 && correctIds.has(selectedArr[0] ?? '');
      } else {
        // multi_select: must match exactly
        correct =
          selectedIds.size === correctIds.size &&
          [...selectedIds].every(id => correctIds.has(id));
      }

      const pts = correct ? question.points : 0;
      earnedPoints += pts;
      answerResults.push({
        questionId: question.id,
        correct,
        pointsEarned: pts,
        pointsAvailable: question.points,
      });
    }

    const score = totalPoints > 0 ? Math.round((earnedPoints / totalPoints) * 100) : 0;
    const passed = score >= quiz.passingScore;
    const submissionId = uuidv4();
    const submittedAt = new Date();

    if (!usingMock) {
      try {
        await query(
          `INSERT INTO quiz_submissions
             (id, quiz_id, user_id, score, passed, attempt_number, answers, submitted_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
          [submissionId, submission.quizId, userId, score, passed, attemptNumber, JSON.stringify(answerResults), submittedAt]
        );

        if (passed) {
          await query(
            `UPDATE enrollments SET quiz_score = $1, status = 'completed', completed_at = NOW()
             WHERE user_id = $2 AND course_id = $3`,
            [score, userId, courseId]
          );
        }
      } catch { /* non-critical for mock */ }
    }

    const result: QuizResult = {
      submissionId,
      quizId: submission.quizId,
      userId,
      score,
      passed,
      attemptNumber,
      submittedAt,
      answers: answerResults,
    };

    logger.info('Quiz submitted', { userId, courseId, score, passed });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}
