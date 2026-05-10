// ─── User & Auth ────────────────────────────────────────────────────────────

export type UserRole = 'employee' | 'it_staff' | 'manager' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  jobTitle: string;
  managerId: string | null;
  avatarUrl: string | null;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
  microsoftId: string | null;
  phoneNumber: string | null;
  riskScore: number;
}

export interface UserWithPassword extends User {
  passwordHash: string | null;
}

export interface TokenPayload {
  userId: string;
  role: UserRole;
  email: string;
  iat?: number;
  exp?: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface MicrosoftLoginRequest {
  code: string;
  state?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ─── Courses & Modules ───────────────────────────────────────────────────────

export type CourseCategory =
  | 'phishing'
  | 'password_security'
  | 'data_privacy'
  | 'social_engineering'
  | 'network_security'
  | 'incident_response'
  | 'compliance'
  | 'malware_awareness';

export type CourseDifficulty = 'beginner' | 'intermediate' | 'advanced';

export type CourseStatus = 'draft' | 'published' | 'archived';

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  estimatedMinutes: number;
  thumbnailUrl: string | null;
  status: CourseStatus;
  passingScore: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  moduleCount?: number;
  enrolledCount?: number;
  completionRate?: number;
  tags: string[];
  isRequired: boolean;
  dueDate: Date | null;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description: string;
  orderIndex: number;
  contentType: 'video' | 'text' | 'interactive' | 'quiz';
  contentUrl: string | null;
  contentHtml: string | null;
  estimatedMinutes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number;
  maxAttempts: number;
  timeLimitMinutes: number | null;
}

export interface QuizQuestion {
  id: string;
  quizId: string;
  questionText: string;
  questionType: 'multiple_choice' | 'true_false' | 'multi_select';
  options: QuizOption[];
  orderIndex: number;
  points: number;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean; // omitted in responses to students
}

export interface QuizSubmission {
  quizId: string;
  answers: QuizAnswer[];
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionIds: string[];
}

export interface QuizResult {
  submissionId: string;
  quizId: string;
  userId: string;
  score: number;
  passed: boolean;
  attemptNumber: number;
  submittedAt: Date;
  answers: AnswerResult[];
}

export interface AnswerResult {
  questionId: string;
  correct: boolean;
  pointsEarned: number;
  pointsAvailable: number;
}

// ─── Progress & Enrollment ───────────────────────────────────────────────────

export type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed' | 'overdue';

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: Date;
  startedAt: Date | null;
  completedAt: Date | null;
  dueDate: Date | null;
  progressPercent: number;
  quizScore: number | null;
  assignedBy: string | null;
  course?: Course;
}

export interface ModuleProgress {
  id: string;
  enrollmentId: string;
  moduleId: string;
  completed: boolean;
  completedAt: Date | null;
  timeSpentSeconds: number;
}

export interface UpdateProgressRequest {
  moduleId: string;
  completed: boolean;
  timeSpentSeconds?: number;
}

// ─── Certificates & Badges ───────────────────────────────────────────────────

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: Date;
  expiresAt: Date | null;
  certificateNumber: string;
  courseTitle: string;
  userName: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  criteria: string;
  earnedAt?: Date;
}

export interface UserBadge {
  id: string;
  userId: string;
  badgeId: string;
  earnedAt: Date;
  badge: Badge;
}

// ─── Phishing Simulation ─────────────────────────────────────────────────────

export type PhishingStatus = 'draft' | 'active' | 'completed' | 'paused';

export interface PhishingCampaign {
  id: string;
  name: string;
  description: string;
  status: PhishingStatus;
  templateId: string;
  targetDepartments: string[];
  targetUserIds: string[];
  scheduledAt: Date;
  completedAt: Date | null;
  createdBy: string;
  createdAt: Date;
  landingPageUrl: string;
  totalTargets: number;
  clickCount: number;
  reportCount: number;
  clickRate?: number;
  reportRate?: number;
}

export interface PhishingTemplate {
  id: string;
  name: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  htmlBody: string;
  difficulty: CourseDifficulty;
  category: string;
}

export interface PhishingEvent {
  id: string;
  campaignId: string;
  userId: string;
  token: string;
  sentAt: Date;
  openedAt: Date | null;
  clickedAt: Date | null;
  reportedAt: Date | null;
  ipAddress: string | null;
  userAgent: string | null;
}

export interface PhishingCampaignResult {
  campaign: PhishingCampaign;
  events: PhishingEvent[];
  stats: PhishingStats;
}

export interface PhishingStats {
  totalSent: number;
  totalOpened: number;
  totalClicked: number;
  totalReported: number;
  openRate: number;
  clickRate: number;
  reportRate: number;
  byDepartment: DepartmentPhishingStats[];
}

export interface DepartmentPhishingStats {
  department: string;
  sent: number;
  clicked: number;
  reported: number;
  clickRate: number;
}

// ─── Notifications ───────────────────────────────────────────────────────────

export type NotificationType =
  | 'course_assigned'
  | 'course_completed'
  | 'certificate_issued'
  | 'badge_earned'
  | 'deadline_reminder'
  | 'phishing_alert'
  | 'system';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: Date;
}

// ─── Reports & Analytics ─────────────────────────────────────────────────────

export interface ComplianceReport {
  generatedAt: Date;
  period: { from: Date; to: Date };
  overallComplianceRate: number;
  totalEmployees: number;
  compliantEmployees: number;
  overdueAssignments: number;
  byDepartment: DepartmentCompliance[];
  byCourse: CourseCompliance[];
  trendData: TrendPoint[];
}

export interface DepartmentCompliance {
  department: string;
  totalEmployees: number;
  compliantEmployees: number;
  complianceRate: number;
  overdueCount: number;
}

export interface CourseCompliance {
  courseId: string;
  courseTitle: string;
  totalAssigned: number;
  totalCompleted: number;
  completionRate: number;
  averageScore: number;
  overdueCount: number;
}

export interface TrendPoint {
  date: string;
  complianceRate: number;
  completions: number;
}

export interface TrainingCompletionReport {
  totalEnrollments: number;
  completedEnrollments: number;
  inProgressEnrollments: number;
  overdueEnrollments: number;
  averageCompletionDays: number;
  averageQuizScore: number;
  completionsByMonth: MonthlyCompletion[];
}

export interface MonthlyCompletion {
  month: string;
  completions: number;
  enrollments: number;
}

export interface RiskAssessmentReport {
  generatedAt: Date;
  highRiskUsers: RiskUser[];
  riskDistribution: RiskDistribution;
  riskFactors: RiskFactor[];
}

export interface RiskUser {
  userId: string;
  name: string;
  email: string;
  department: string;
  riskScore: number;
  riskFactors: string[];
}

export interface RiskDistribution {
  high: number;
  medium: number;
  low: number;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  affectedUsers: number;
}

// ─── Admin ───────────────────────────────────────────────────────────────────

export interface CreateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  jobTitle: string;
  managerId?: string;
  phoneNumber?: string;
  password?: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: UserRole;
  department?: string;
  jobTitle?: string;
  managerId?: string;
  phoneNumber?: string;
  isActive?: boolean;
}

export interface CourseAssignmentRequest {
  courseId: string;
  userIds?: string[];
  departments?: string[];
  dueDate?: string;
  assignedBy: string;
}

export interface CreateCourseRequest {
  title: string;
  description: string;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  estimatedMinutes: number;
  passingScore: number;
  tags?: string[];
  isRequired?: boolean;
  modules?: Omit<CourseModule, 'id' | 'courseId' | 'createdAt' | 'updatedAt'>[];
}

// ─── Pagination & Query ───────────────────────────────────────────────────────

export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ─── Audit Log ───────────────────────────────────────────────────────────────

export interface AuditLogEntry {
  id: string;
  userId: string | null;
  action: string;
  resource: string;
  resourceId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  details: Record<string, unknown> | null;
  timestamp: Date;
  userName?: string;
}

// ─── Express augmentation ────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
      requestId?: string;
    }
  }
}
