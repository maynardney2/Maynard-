// ============================================================
//  CyberShield LMS – Complete Type Definitions
// ============================================================

// ----------------------------------------------------------
// Auth & User
// ----------------------------------------------------------

export type UserRole = 'employee' | 'it_staff' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatar?: string;
  securityScore: number;          // 0–100
  completedCourses: string[];     // course IDs
  badges: Badge[];
  createdAt: string;              // ISO date string
  lastLogin: string;              // ISO date string
  mfaEnabled: boolean;
  isActive: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// ----------------------------------------------------------
// Courses & Curriculum
// ----------------------------------------------------------

export type SlideType = 'content' | 'scenario' | 'video' | 'infographic';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';
export type CourseCategory =
  | 'core_awareness'
  | 'bpo_data_security'
  | 'm365_security'
  | 'it_helpdesk'
  | 'ai_modern_threats';

export interface Slide {
  id: string;
  title: string;
  content: string[];            // bullet-point lines
  speakerNotes: string;
  type: SlideType;
  imageUrl?: string;
}

export interface Question {
  id: string;
  text: string;
  options: string[];            // exactly 4 options
  correctAnswer: number;        // 0-based index
  explanation: string;
  difficulty: DifficultyLevel;
}

export interface Quiz {
  id: string;
  questions: Question[];
  passingScore: number;         // percentage, e.g. 80
  timeLimit: number;            // minutes
}

export interface Module {
  id: string;
  title: string;
  content: Slide[];
  quiz: Quiz;
  duration: number;             // minutes
  order: number;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  duration: number;             // total minutes
  difficulty: DifficultyLevel;
  modules: Module[];
  thumbnail: string;            // emoji or URL
  tags: string[];
  requiredFor: UserRole[];
  isRequired: boolean;
  xpReward: number;
  createdAt: string;
  updatedAt: string;
}

// ----------------------------------------------------------
// Progress & Assignments
// ----------------------------------------------------------

export type ProgressStatus = 'not_started' | 'in_progress' | 'completed';
export type AssignmentStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';

export interface Progress {
  userId: string;
  courseId: string;
  status: ProgressStatus;
  score: number;                // last quiz score %
  completedAt?: string;
  attempts: number;
  moduleProgress: Record<string, number>; // moduleId → slide index reached
}

export interface TrainingAssignment {
  id: string;
  userId: string;
  courseId: string;
  assignedBy: string;           // admin/manager user ID
  dueDate: string;
  isRequired: boolean;
  status: AssignmentStatus;
}

// ----------------------------------------------------------
// Phishing Simulations
// ----------------------------------------------------------

export type PhishingType = 'email' | 'sms' | 'qr' | 'voice';
export type PhishingCategory =
  | 'credential_harvest'
  | 'malware'
  | 'social_engineering'
  | 'urgency';
export type PhishingIndustry = 'bpo' | 'general' | 'microsoft' | 'banking';

export interface PhishingCampaign {
  id: string;
  name: string;
  type: PhishingType;
  sentAt: string;
  clickRate: number;            // percentage
  reportRate: number;           // percentage
  targetDepartments: string[];
  templateId: string;
  status: 'draft' | 'running' | 'completed';
  totalSent: number;
}

export interface PhishingResult {
  userId: string;
  campaignId: string;
  clicked: boolean;
  reported: boolean;
  reportedAt?: string;
  clickedAt?: string;
}

export interface PhishingTemplate {
  id: string;
  name: string;
  type: PhishingType;
  difficulty: DifficultyLevel;
  subject?: string;             // email/sms subject
  message: string;              // body content
  redFlags: string[];
  category: PhishingCategory;
  industry: PhishingIndustry;
  senderName?: string;
  senderEmail?: string;
}

// ----------------------------------------------------------
// Badges & Certificates
// ----------------------------------------------------------

export type BadgeCategory =
  | 'completion'
  | 'performance'
  | 'streak'
  | 'phishing'
  | 'leadership'
  | 'special';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;                 // emoji or icon name
  category: BadgeCategory;
  earnedAt?: string;
}

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  issuedAt: string;
  expiresAt: string;
  certificateNumber: string;
}

// ----------------------------------------------------------
// Leaderboard & Departments
// ----------------------------------------------------------

export interface LeaderboardEntry {
  rank: number;
  user: Pick<User, 'id' | 'name' | 'avatar' | 'department'>;
  score: number;
  completedCourses: number;
  badges: number;
}

export interface Department {
  id: string;
  name: string;
  complianceScore: number;      // 0–100
  employeeCount: number;
  completionRate: number;       // percentage
}

// ----------------------------------------------------------
// Audit & Notifications
// ----------------------------------------------------------

export type NotificationType =
  | 'course_assigned'
  | 'course_completed'
  | 'badge_earned'
  | 'phishing_alert'
  | 'deadline_reminder'
  | 'system_alert'
  | 'compliance_warning';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  timestamp: string;
  ipAddress: string;
  details?: Record<string, unknown>;
}

// ----------------------------------------------------------
// Reports
// ----------------------------------------------------------

export interface ComplianceReport {
  period: string;               // e.g. "Q1 2025"
  totalEmployees: number;
  completionRate: number;
  avgScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  byDepartment: {
    department: string;
    completionRate: number;
    avgScore: number;
    employeeCount: number;
  }[];
  phishingStats: {
    campaignsSent: number;
    avgClickRate: number;
    avgReportRate: number;
    improvement: number;        // percentage points vs previous period
  };
}

// ----------------------------------------------------------
// UI / App State
// ----------------------------------------------------------

export interface AppNotification extends Notification {
  // alias kept for backwards-compatibility in context
}

export type ThemeMode = 'light' | 'dark';

export interface AppState {
  sidebarCollapsed: boolean;
  theme: ThemeMode;
  notifications: Notification[];
}
