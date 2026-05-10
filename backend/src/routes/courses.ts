import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { auditLog } from '../middleware/audit';
import * as courseController from '../controllers/courseController';

const router = Router();

// All course routes require authentication
router.use(verifyToken);

/**
 * GET /api/v1/courses
 * List all published courses with optional filters:
 *   ?category=phishing&difficulty=beginner&search=password&page=1&limit=20
 */
router.get('/', courseController.listCourses);

/**
 * GET /api/v1/courses/:id
 * Get a single course by ID (with enrollment status for current user)
 */
router.get('/:id', courseController.getCourse);

/**
 * GET /api/v1/courses/:id/modules
 * Get all modules for a course (ordered by orderIndex)
 */
router.get('/:id/modules', courseController.getCourseModules);

/**
 * POST /api/v1/courses/:id/enroll
 * Self-enrol in a course
 */
router.post('/:id/enroll', auditLog('enroll', 'course'), courseController.enrollInCourse);

/**
 * POST /api/v1/courses/:id/progress
 * Update module-level progress
 * Body: { moduleId, completed, timeSpentSeconds? }
 */
router.post('/:id/progress', courseController.updateProgress);

/**
 * GET /api/v1/courses/:id/quiz
 * Get the quiz for a course (correct answers stripped)
 */
router.get('/:id/quiz', courseController.getCourseQuiz);

/**
 * POST /api/v1/courses/:id/quiz/submit
 * Submit quiz answers
 * Body: { quizId, answers: [{ questionId, selectedOptionIds }] }
 */
router.post(
  '/:id/quiz/submit',
  auditLog('quiz_submit', 'course'),
  courseController.submitQuiz
);

export default router;
