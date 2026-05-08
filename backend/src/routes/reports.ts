import { Router } from 'express';
import { verifyToken } from '../middleware/auth';
import { requireMinRole } from '../middleware/rbac';
import * as reportController from '../controllers/reportController';

const router = Router();

// All report routes require authentication + at minimum manager role
router.use(verifyToken);
router.use(requireMinRole('manager'));

/**
 * GET /api/v1/reports/compliance
 * Overall compliance metrics
 * Query: ?from=2024-01-01&to=2024-12-31
 */
router.get('/compliance', reportController.getComplianceReport);

/**
 * GET /api/v1/reports/compliance/by-department
 * Compliance breakdown per department
 */
router.get('/compliance/by-department', reportController.getComplianceByDepartment);

/**
 * GET /api/v1/reports/phishing-stats
 * Phishing simulation statistics
 */
router.get('/phishing-stats', reportController.getPhishingStats);

/**
 * GET /api/v1/reports/training-completion
 * Training completion rates and timelines
 */
router.get('/training-completion', reportController.getTrainingCompletion);

/**
 * GET /api/v1/reports/risk-assessment
 * User risk assessment and distribution
 */
router.get('/risk-assessment', reportController.getRiskAssessment);

/**
 * GET /api/v1/reports/export/compliance
 * Download compliance report as CSV
 */
router.get('/export/compliance', reportController.exportComplianceCsv);

/**
 * GET /api/v1/reports/export/certificates
 * Download certificate report as CSV
 */
router.get('/export/certificates', reportController.exportCertificates);

export default router;
