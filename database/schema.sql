-- =============================================================================
-- CyberShield LMS - PostgreSQL Database Schema
-- Enterprise Cybersecurity Awareness Training Platform for BPO Organizations
-- =============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "citext";

-- =============================================================================
-- ENUMS
-- =============================================================================

CREATE TYPE user_role AS ENUM ('employee', 'it_staff', 'manager', 'admin');

CREATE TYPE course_category AS ENUM (
    'core_security',
    'bpo_security',
    'microsoft_security',
    'it_helpdesk',
    'ai_threats'
);

CREATE TYPE difficulty_level AS ENUM ('beginner', 'intermediate', 'advanced');

CREATE TYPE slide_type AS ENUM ('content', 'scenario', 'video', 'infographic', 'policy');

CREATE TYPE question_type AS ENUM ('multiple_choice', 'true_false');

CREATE TYPE progress_status AS ENUM ('not_started', 'in_progress', 'completed', 'failed');

CREATE TYPE badge_category AS ENUM ('achievement', 'streak', 'security', 'completion', 'special');

CREATE TYPE phishing_type AS ENUM ('email', 'sms', 'qr_code', 'voice');

CREATE TYPE phishing_status AS ENUM ('draft', 'active', 'completed', 'paused');

CREATE TYPE phishing_target_type AS ENUM ('all', 'department', 'custom');

CREATE TYPE notification_type AS ENUM (
    'course_assigned',
    'course_due',
    'badge_earned',
    'phishing_caught',
    'phishing_reported',
    'compliance_alert',
    'system'
);

-- =============================================================================
-- TABLE: departments
-- Must be created before users due to FK reference
-- =============================================================================

CREATE TABLE departments (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    code        VARCHAR(20)  NOT NULL UNIQUE,
    manager_id  UUID         NULL,         -- FK to users added after users table
    description TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT departments_name_not_empty CHECK (char_length(trim(name)) > 0),
    CONSTRAINT departments_code_uppercase CHECK (code = upper(code))
);

COMMENT ON TABLE  departments              IS 'Organizational departments within the BPO';
COMMENT ON COLUMN departments.code        IS 'Short uppercase identifier, e.g. OPS, IT, HR';
COMMENT ON COLUMN departments.manager_id  IS 'Department head; references users(id)';

-- =============================================================================
-- TABLE: users
-- =============================================================================

CREATE TABLE users (
    id                      UUID         PRIMARY KEY DEFAULT uuid_generate_v4(),
    email                   CITEXT       NOT NULL UNIQUE,
    password_hash           TEXT         NOT NULL,
    first_name              VARCHAR(100) NOT NULL,
    last_name               VARCHAR(100) NOT NULL,
    display_name            VARCHAR(200) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    avatar_url              TEXT,
    role                    user_role    NOT NULL DEFAULT 'employee',
    department_id           INTEGER      REFERENCES departments(id) ON DELETE SET NULL,
    employee_id             VARCHAR(50)  UNIQUE,
    security_score          SMALLINT     NOT NULL DEFAULT 0
                                         CHECK (security_score BETWEEN 0 AND 100),
    is_active               BOOLEAN      NOT NULL DEFAULT TRUE,
    is_locked               BOOLEAN      NOT NULL DEFAULT FALSE,
    mfa_enabled             BOOLEAN      NOT NULL DEFAULT FALSE,
    last_login              TIMESTAMPTZ,
    failed_login_attempts   SMALLINT     NOT NULL DEFAULT 0
                                         CHECK (failed_login_attempts >= 0),
    password_changed_at     TIMESTAMPTZ,
    created_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT users_email_format CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_first_name_not_empty CHECK (char_length(trim(first_name)) > 0),
    CONSTRAINT users_last_name_not_empty  CHECK (char_length(trim(last_name)) > 0)
);

COMMENT ON TABLE  users                        IS 'Platform users — employees, IT staff, managers, and admins';
COMMENT ON COLUMN users.security_score         IS 'Aggregated 0-100 score updated by security_scores calculations';
COMMENT ON COLUMN users.failed_login_attempts  IS 'Resets to 0 on successful login; account locks at threshold';
COMMENT ON COLUMN users.password_changed_at    IS 'NULL means password has never been changed from default';
COMMENT ON COLUMN users.employee_id            IS 'HR system identifier; must be unique when provided';

-- Add deferred FK from departments back to users
ALTER TABLE departments
    ADD CONSTRAINT departments_manager_id_fkey
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE SET NULL;

-- =============================================================================
-- TABLE: courses
-- =============================================================================

CREATE TABLE courses (
    id                UUID           PRIMARY KEY DEFAULT uuid_generate_v4(),
    title             VARCHAR(200)   NOT NULL,
    slug              VARCHAR(200)   NOT NULL UNIQUE,
    description       VARCHAR(500)   NOT NULL,
    long_description  TEXT,
    category          course_category NOT NULL,
    thumbnail_url     TEXT,
    duration_minutes  SMALLINT       NOT NULL CHECK (duration_minutes > 0),
    difficulty        difficulty_level NOT NULL DEFAULT 'beginner',
    passing_score     SMALLINT       NOT NULL DEFAULT 80
                                     CHECK (passing_score BETWEEN 1 AND 100),
    xp_reward         SMALLINT       NOT NULL DEFAULT 100
                                     CHECK (xp_reward >= 0),
    is_required       BOOLEAN        NOT NULL DEFAULT FALSE,
    is_active         BOOLEAN        NOT NULL DEFAULT TRUE,
    version           VARCHAR(20)    NOT NULL DEFAULT '1.0.0',
    created_by        UUID           REFERENCES users(id) ON DELETE SET NULL,
    created_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ    NOT NULL DEFAULT NOW(),

    CONSTRAINT courses_title_not_empty CHECK (char_length(trim(title)) > 0),
    CONSTRAINT courses_slug_format     CHECK (slug ~ '^[a-z0-9\-]+$')
);

COMMENT ON TABLE  courses               IS 'Training courses organized by security category';
COMMENT ON COLUMN courses.slug         IS 'URL-safe lowercase identifier';
COMMENT ON COLUMN courses.passing_score IS 'Minimum quiz score (%) required to earn a certificate';
COMMENT ON COLUMN courses.xp_reward    IS 'Experience points awarded upon course completion';
COMMENT ON COLUMN courses.version      IS 'Semantic version; increment when content changes materially';

-- =============================================================================
-- TABLE: course_modules
-- =============================================================================

CREATE TABLE course_modules (
    id               SERIAL       PRIMARY KEY,
    course_id        UUID         NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title            VARCHAR(200) NOT NULL,
    description      TEXT,
    order_index      SMALLINT     NOT NULL CHECK (order_index >= 0),
    duration_minutes SMALLINT     NOT NULL DEFAULT 5 CHECK (duration_minutes > 0),
    is_active        BOOLEAN      NOT NULL DEFAULT TRUE,

    CONSTRAINT course_modules_unique_order UNIQUE (course_id, order_index),
    CONSTRAINT course_modules_title_not_empty CHECK (char_length(trim(title)) > 0)
);

COMMENT ON TABLE  course_modules             IS 'Ordered modules within a course';
COMMENT ON COLUMN course_modules.order_index IS 'Zero-based position; must be unique per course';

-- =============================================================================
-- TABLE: slides
-- =============================================================================

CREATE TABLE slides (
    id            SERIAL      PRIMARY KEY,
    module_id     INTEGER     NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title         VARCHAR(200) NOT NULL,
    content       JSONB       NOT NULL DEFAULT '{}',
    slide_type    slide_type  NOT NULL DEFAULT 'content',
    order_index   SMALLINT    NOT NULL CHECK (order_index >= 0),
    speaker_notes TEXT,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT slides_unique_order    UNIQUE (module_id, order_index),
    CONSTRAINT slides_title_not_empty CHECK (char_length(trim(title)) > 0),
    CONSTRAINT slides_content_is_obj  CHECK (jsonb_typeof(content) = 'object')
);

COMMENT ON TABLE  slides         IS 'Individual slide content within a module';
COMMENT ON COLUMN slides.content IS 'Flexible JSONB payload: { bullets, image_url, video_url, scenario, policy_text, ... }';

-- =============================================================================
-- TABLE: quizzes
-- =============================================================================

CREATE TABLE quizzes (
    id                  SERIAL      PRIMARY KEY,
    course_id           UUID        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title               VARCHAR(200) NOT NULL,
    passing_score       SMALLINT    NOT NULL DEFAULT 80
                                    CHECK (passing_score BETWEEN 1 AND 100),
    time_limit_seconds  INTEGER     CHECK (time_limit_seconds > 0),
    randomize_questions BOOLEAN     NOT NULL DEFAULT TRUE,
    max_attempts        SMALLINT    NOT NULL DEFAULT 3
                                    CHECK (max_attempts > 0),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT quizzes_title_not_empty CHECK (char_length(trim(title)) > 0)
);

COMMENT ON TABLE  quizzes                  IS 'Assessment quizzes attached to a course';
COMMENT ON COLUMN quizzes.time_limit_seconds IS 'NULL means no time limit';
COMMENT ON COLUMN quizzes.max_attempts     IS 'Maximum allowed quiz attempts per user';

-- =============================================================================
-- TABLE: quiz_questions
-- =============================================================================

CREATE TABLE quiz_questions (
    id            SERIAL        PRIMARY KEY,
    quiz_id       INTEGER       NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT          NOT NULL,
    question_type question_type NOT NULL DEFAULT 'multiple_choice',
    difficulty    difficulty_level NOT NULL DEFAULT 'beginner',
    explanation   TEXT,
    order_index   SMALLINT      NOT NULL CHECK (order_index >= 0),
    points        SMALLINT      NOT NULL DEFAULT 1 CHECK (points > 0),
    created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW(),

    CONSTRAINT quiz_questions_unique_order    UNIQUE (quiz_id, order_index),
    CONSTRAINT quiz_questions_text_not_empty  CHECK (char_length(trim(question_text)) > 0)
);

COMMENT ON TABLE  quiz_questions            IS 'Individual questions within a quiz';
COMMENT ON COLUMN quiz_questions.explanation IS 'Shown to the learner after answering, regardless of correctness';
COMMENT ON COLUMN quiz_questions.points     IS 'Score weight for this question';

-- =============================================================================
-- TABLE: quiz_options
-- =============================================================================

CREATE TABLE quiz_options (
    id          SERIAL      PRIMARY KEY,
    question_id INTEGER     NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    option_text TEXT        NOT NULL,
    is_correct  BOOLEAN     NOT NULL DEFAULT FALSE,
    order_index SMALLINT    NOT NULL CHECK (order_index >= 0),

    CONSTRAINT quiz_options_unique_order      UNIQUE (question_id, order_index),
    CONSTRAINT quiz_options_text_not_empty    CHECK (char_length(trim(option_text)) > 0)
);

COMMENT ON TABLE  quiz_options           IS 'Answer options for each quiz question';
COMMENT ON COLUMN quiz_options.is_correct IS 'Only one option per question should be TRUE for single-answer questions';

-- =============================================================================
-- TABLE: user_progress
-- =============================================================================

CREATE TABLE user_progress (
    id                  SERIAL          PRIMARY KEY,
    user_id             UUID            NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id           UUID            NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    module_id           INTEGER         REFERENCES course_modules(id) ON DELETE SET NULL,
    status              progress_status NOT NULL DEFAULT 'not_started',
    progress_percentage SMALLINT        NOT NULL DEFAULT 0
                                        CHECK (progress_percentage BETWEEN 0 AND 100),
    started_at          TIMESTAMPTZ,
    completed_at        TIMESTAMPTZ,
    time_spent_seconds  INTEGER         NOT NULL DEFAULT 0 CHECK (time_spent_seconds >= 0),

    CONSTRAINT user_progress_unique_enrollment UNIQUE (user_id, course_id),
    CONSTRAINT user_progress_completed_at_check
        CHECK (completed_at IS NULL OR started_at IS NOT NULL),
    CONSTRAINT user_progress_percentage_completed_check
        CHECK (status != 'completed' OR progress_percentage = 100)
);

COMMENT ON TABLE  user_progress                   IS 'Per-user course enrollment and progress tracking';
COMMENT ON COLUMN user_progress.module_id         IS 'Last module the user was active in; NULL if not yet started';
COMMENT ON COLUMN user_progress.time_spent_seconds IS 'Cumulative active time in the course';

-- =============================================================================
-- TABLE: quiz_attempts
-- =============================================================================

CREATE TABLE quiz_attempts (
    id                SERIAL      PRIMARY KEY,
    user_id           UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id           INTEGER     NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    course_id         UUID        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    score             SMALLINT    NOT NULL CHECK (score BETWEEN 0 AND 100),
    passed            BOOLEAN     NOT NULL,
    time_taken_seconds INTEGER    CHECK (time_taken_seconds >= 0),
    started_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at      TIMESTAMPTZ,

    CONSTRAINT quiz_attempts_completed_after_started
        CHECK (completed_at IS NULL OR completed_at >= started_at)
);

COMMENT ON TABLE quiz_attempts IS 'Each attempt a user makes at a quiz';

-- =============================================================================
-- TABLE: quiz_attempt_answers
-- =============================================================================

CREATE TABLE quiz_attempt_answers (
    id                 SERIAL      PRIMARY KEY,
    attempt_id         INTEGER     NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
    question_id        INTEGER     NOT NULL REFERENCES quiz_questions(id) ON DELETE CASCADE,
    selected_option_id INTEGER     REFERENCES quiz_options(id) ON DELETE SET NULL,
    is_correct         BOOLEAN     NOT NULL DEFAULT FALSE,
    time_taken_seconds INTEGER     CHECK (time_taken_seconds >= 0),

    CONSTRAINT quiz_attempt_answers_unique UNIQUE (attempt_id, question_id)
);

COMMENT ON TABLE  quiz_attempt_answers                   IS 'Individual answers within a quiz attempt';
COMMENT ON COLUMN quiz_attempt_answers.selected_option_id IS 'NULL if the user skipped or timed out on this question';

-- =============================================================================
-- TABLE: certificates
-- =============================================================================

CREATE TABLE certificates (
    id                 UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    certificate_number VARCHAR(50) NOT NULL UNIQUE,
    user_id            UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id          UUID        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    issued_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at         TIMESTAMPTZ,
    is_valid           BOOLEAN     NOT NULL DEFAULT TRUE,
    pdf_url            TEXT,

    CONSTRAINT certificates_expires_after_issued
        CHECK (expires_at IS NULL OR expires_at > issued_at)
);

COMMENT ON TABLE  certificates                    IS 'Completion certificates issued upon passing a course quiz';
COMMENT ON COLUMN certificates.certificate_number IS 'Human-readable unique reference, e.g. CSLD-2024-000001';
COMMENT ON COLUMN certificates.is_valid           IS 'Set FALSE when revoked or course version invalidates prior completions';

-- =============================================================================
-- TABLE: badges
-- =============================================================================

CREATE TABLE badges (
    id          SERIAL         PRIMARY KEY,
    name        VARCHAR(100)   NOT NULL UNIQUE,
    description TEXT           NOT NULL,
    icon        VARCHAR(200)   NOT NULL,
    category    badge_category NOT NULL,
    xp_value    SMALLINT       NOT NULL DEFAULT 50 CHECK (xp_value >= 0),
    criteria    JSONB          NOT NULL DEFAULT '{}',

    CONSTRAINT badges_name_not_empty CHECK (char_length(trim(name)) > 0),
    CONSTRAINT badges_criteria_is_obj CHECK (jsonb_typeof(criteria) = 'object')
);

COMMENT ON TABLE  badges          IS 'Gamification badges earnable by users';
COMMENT ON COLUMN badges.icon     IS 'Icon identifier or URL used in the UI';
COMMENT ON COLUMN badges.criteria IS 'JSON rules engine payload; e.g. {"type":"streak","days":7}';

-- =============================================================================
-- TABLE: user_badges
-- =============================================================================

CREATE TABLE user_badges (
    id         SERIAL      PRIMARY KEY,
    user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id   INTEGER     NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT user_badges_unique UNIQUE (user_id, badge_id)
);

COMMENT ON TABLE user_badges IS 'Junction table: badges earned by users';

-- =============================================================================
-- TABLE: training_assignments
-- =============================================================================

CREATE TABLE training_assignments (
    id              SERIAL      PRIMARY KEY,
    user_id         UUID        REFERENCES users(id) ON DELETE CASCADE,
    department_id   INTEGER     REFERENCES departments(id) ON DELETE CASCADE,
    course_id       UUID        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    assigned_by     UUID        NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    due_date        DATE,
    is_required     BOOLEAN     NOT NULL DEFAULT FALSE,
    status          VARCHAR(50) NOT NULL DEFAULT 'pending',
    assigned_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at    TIMESTAMPTZ,
    reminder_sent_at TIMESTAMPTZ,

    CONSTRAINT training_assignments_target_check
        CHECK (user_id IS NOT NULL OR department_id IS NOT NULL),
    CONSTRAINT training_assignments_status_values
        CHECK (status IN ('pending', 'in_progress', 'completed', 'overdue', 'waived')),
    CONSTRAINT training_assignments_completed_after_assigned
        CHECK (completed_at IS NULL OR completed_at >= assigned_at)
);

COMMENT ON TABLE  training_assignments            IS 'Course assignments targeting individual users or whole departments';
COMMENT ON COLUMN training_assignments.user_id    IS 'NULL when assigning to an entire department';
COMMENT ON COLUMN training_assignments.department_id IS 'NULL when assigning to a specific user';
COMMENT ON COLUMN training_assignments.status     IS 'pending | in_progress | completed | overdue | waived';

-- =============================================================================
-- TABLE: phishing_templates
-- Must be created before phishing_campaigns
-- =============================================================================

CREATE TABLE phishing_templates (
    id           SERIAL       PRIMARY KEY,
    name         VARCHAR(200) NOT NULL UNIQUE,
    category     VARCHAR(100) NOT NULL,
    difficulty   difficulty_level NOT NULL DEFAULT 'beginner',
    subject      VARCHAR(500) NOT NULL,
    body_html    TEXT         NOT NULL,
    body_text    TEXT         NOT NULL,
    sender_name  VARCHAR(200) NOT NULL,
    sender_email VARCHAR(320) NOT NULL,
    red_flags    JSONB        NOT NULL DEFAULT '[]',
    is_active    BOOLEAN      NOT NULL DEFAULT TRUE,

    CONSTRAINT phishing_templates_name_not_empty    CHECK (char_length(trim(name)) > 0),
    CONSTRAINT phishing_templates_red_flags_is_array CHECK (jsonb_typeof(red_flags) = 'array')
);

COMMENT ON TABLE  phishing_templates           IS 'Reusable templates for simulated phishing campaigns';
COMMENT ON COLUMN phishing_templates.red_flags IS 'JSON array of clue descriptions used in debriefing';

-- =============================================================================
-- TABLE: phishing_campaigns
-- =============================================================================

CREATE TABLE phishing_campaigns (
    id          UUID                 PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        VARCHAR(200)         NOT NULL,
    description TEXT,
    type        phishing_type        NOT NULL DEFAULT 'email',
    status      phishing_status      NOT NULL DEFAULT 'draft',
    target_type phishing_target_type NOT NULL DEFAULT 'all',
    template_id INTEGER              REFERENCES phishing_templates(id) ON DELETE SET NULL,
    launched_by UUID                 REFERENCES users(id) ON DELETE SET NULL,
    launched_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at  TIMESTAMPTZ          NOT NULL DEFAULT NOW(),

    CONSTRAINT phishing_campaigns_name_not_empty CHECK (char_length(trim(name)) > 0),
    CONSTRAINT phishing_campaigns_completed_after_launched
        CHECK (completed_at IS NULL OR launched_at IS NULL OR completed_at >= launched_at)
);

COMMENT ON TABLE phishing_campaigns IS 'Simulated phishing campaigns for security awareness testing';

-- =============================================================================
-- TABLE: phishing_targets
-- =============================================================================

CREATE TABLE phishing_targets (
    id           SERIAL      PRIMARY KEY,
    campaign_id  UUID        NOT NULL REFERENCES phishing_campaigns(id) ON DELETE CASCADE,
    user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_sent_at TIMESTAMPTZ,
    clicked_at   TIMESTAMPTZ,
    reported_at  TIMESTAMPTZ,
    click_token  VARCHAR(128) UNIQUE,
    report_token VARCHAR(128) UNIQUE,

    CONSTRAINT phishing_targets_unique_per_campaign UNIQUE (campaign_id, user_id),
    CONSTRAINT phishing_targets_clicked_after_sent
        CHECK (clicked_at IS NULL OR email_sent_at IS NULL OR clicked_at >= email_sent_at),
    CONSTRAINT phishing_targets_reported_after_sent
        CHECK (reported_at IS NULL OR email_sent_at IS NULL OR reported_at >= email_sent_at)
);

COMMENT ON TABLE  phishing_targets             IS 'Individual users targeted in a phishing campaign';
COMMENT ON COLUMN phishing_targets.click_token IS 'Unique token embedded in phishing link for click tracking';
COMMENT ON COLUMN phishing_targets.report_token IS 'Unique token used when user reports the phishing email';

-- =============================================================================
-- TABLE: audit_logs
-- =============================================================================

CREATE TABLE audit_logs (
    id             UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID        REFERENCES users(id) ON DELETE SET NULL,
    session_id     UUID,
    action         VARCHAR(100) NOT NULL,
    resource_type  VARCHAR(100),
    resource_id    VARCHAR(100),
    old_values     JSONB,
    new_values     JSONB,
    ip_address     INET,
    user_agent     TEXT,
    request_method VARCHAR(10),
    request_path   TEXT,
    status_code    SMALLINT,
    created_at     TIMESTAMPTZ  NOT NULL DEFAULT NOW(),

    CONSTRAINT audit_logs_action_not_empty CHECK (char_length(trim(action)) > 0)
);

COMMENT ON TABLE  audit_logs             IS 'Immutable audit trail of all significant platform actions';
COMMENT ON COLUMN audit_logs.old_values  IS 'State before the action; NULL for CREATE operations';
COMMENT ON COLUMN audit_logs.new_values  IS 'State after the action; NULL for DELETE operations';
COMMENT ON COLUMN audit_logs.session_id  IS 'References sessions(id) without FK to preserve logs after session deletion';

-- =============================================================================
-- TABLE: notifications
-- =============================================================================

CREATE TABLE notifications (
    id         UUID              PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID              NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       notification_type NOT NULL,
    title      VARCHAR(200)      NOT NULL,
    message    TEXT              NOT NULL,
    data       JSONB             NOT NULL DEFAULT '{}',
    is_read    BOOLEAN           NOT NULL DEFAULT FALSE,
    read_at    TIMESTAMPTZ,
    created_at TIMESTAMPTZ       NOT NULL DEFAULT NOW(),

    CONSTRAINT notifications_read_at_consistency
        CHECK (is_read = FALSE OR read_at IS NOT NULL),
    CONSTRAINT notifications_data_is_obj
        CHECK (jsonb_typeof(data) = 'object')
);

COMMENT ON TABLE  notifications      IS 'In-platform notifications delivered to individual users';
COMMENT ON COLUMN notifications.data IS 'Payload for deep-linking, e.g. {"course_id":"...", "badge_id":1}';

-- =============================================================================
-- TABLE: security_scores
-- =============================================================================

CREATE TABLE security_scores (
    id           SERIAL      PRIMARY KEY,
    user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    score        SMALLINT    NOT NULL CHECK (score BETWEEN 0 AND 100),
    factors      JSONB       NOT NULL DEFAULT '{}',
    calculated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT security_scores_factors_is_obj CHECK (jsonb_typeof(factors) = 'object')
);

COMMENT ON TABLE  security_scores         IS 'Historical security score snapshots for trend analysis';
COMMENT ON COLUMN security_scores.factors IS 'Breakdown: {"course_completion":40,"quiz_scores":25,"phishing_reports":15,"streak":10,"badges":10}';

-- =============================================================================
-- TABLE: sessions
-- =============================================================================

CREATE TABLE sessions (
    id                 UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id            UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash TEXT        NOT NULL UNIQUE,
    ip_address         INET,
    user_agent         TEXT,
    expires_at         TIMESTAMPTZ NOT NULL,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_used_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_revoked         BOOLEAN     NOT NULL DEFAULT FALSE,

    CONSTRAINT sessions_expires_after_created CHECK (expires_at > created_at)
);

COMMENT ON TABLE  sessions                   IS 'Active refresh-token sessions for JWT-based authentication';
COMMENT ON COLUMN sessions.refresh_token_hash IS 'bcrypt/argon2 hash of the refresh token; never store the raw token';
COMMENT ON COLUMN sessions.is_revoked         IS 'Soft-delete flag; revoked sessions are ignored during token refresh';

-- =============================================================================
-- INDEXES
-- =============================================================================

-- departments
CREATE INDEX idx_departments_manager_id  ON departments(manager_id);
CREATE INDEX idx_departments_is_active   ON departments(is_active);

-- users
CREATE INDEX idx_users_department_id     ON users(department_id);
CREATE INDEX idx_users_role              ON users(role);
CREATE INDEX idx_users_is_active         ON users(is_active);
CREATE INDEX idx_users_is_locked         ON users(is_locked);
CREATE INDEX idx_users_security_score    ON users(security_score DESC);
CREATE INDEX idx_users_last_login        ON users(last_login DESC);
CREATE INDEX idx_users_employee_id       ON users(employee_id) WHERE employee_id IS NOT NULL;

-- courses
CREATE INDEX idx_courses_category        ON courses(category);
CREATE INDEX idx_courses_difficulty      ON courses(difficulty);
CREATE INDEX idx_courses_is_active       ON courses(is_active);
CREATE INDEX idx_courses_is_required     ON courses(is_required);
CREATE INDEX idx_courses_created_by      ON courses(created_by);
CREATE INDEX idx_courses_slug            ON courses(slug);

-- course_modules
CREATE INDEX idx_course_modules_course_id  ON course_modules(course_id);
CREATE INDEX idx_course_modules_is_active  ON course_modules(course_id, is_active);

-- slides
CREATE INDEX idx_slides_module_id         ON slides(module_id);
CREATE INDEX idx_slides_slide_type        ON slides(slide_type);

-- quizzes
CREATE INDEX idx_quizzes_course_id        ON quizzes(course_id);

-- quiz_questions
CREATE INDEX idx_quiz_questions_quiz_id   ON quiz_questions(quiz_id);
CREATE INDEX idx_quiz_questions_difficulty ON quiz_questions(difficulty);

-- quiz_options
CREATE INDEX idx_quiz_options_question_id ON quiz_options(question_id);

-- user_progress
CREATE INDEX idx_user_progress_user_id    ON user_progress(user_id);
CREATE INDEX idx_user_progress_course_id  ON user_progress(course_id);
CREATE INDEX idx_user_progress_status     ON user_progress(status);
CREATE INDEX idx_user_progress_module_id  ON user_progress(module_id) WHERE module_id IS NOT NULL;
CREATE INDEX idx_user_progress_user_status ON user_progress(user_id, status);
CREATE INDEX idx_user_progress_completed_at ON user_progress(completed_at DESC) WHERE completed_at IS NOT NULL;

-- quiz_attempts
CREATE INDEX idx_quiz_attempts_user_id    ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_quiz_id    ON quiz_attempts(quiz_id);
CREATE INDEX idx_quiz_attempts_course_id  ON quiz_attempts(course_id);
CREATE INDEX idx_quiz_attempts_user_quiz  ON quiz_attempts(user_id, quiz_id);
CREATE INDEX idx_quiz_attempts_started_at ON quiz_attempts(started_at DESC);

-- quiz_attempt_answers
CREATE INDEX idx_quiz_attempt_answers_attempt_id  ON quiz_attempt_answers(attempt_id);
CREATE INDEX idx_quiz_attempt_answers_question_id ON quiz_attempt_answers(question_id);

-- certificates
CREATE INDEX idx_certificates_user_id     ON certificates(user_id);
CREATE INDEX idx_certificates_course_id   ON certificates(course_id);
CREATE INDEX idx_certificates_user_course ON certificates(user_id, course_id);
CREATE INDEX idx_certificates_issued_at   ON certificates(issued_at DESC);
CREATE INDEX idx_certificates_is_valid    ON certificates(is_valid) WHERE is_valid = TRUE;

-- badges
CREATE INDEX idx_badges_category          ON badges(category);

-- user_badges
CREATE INDEX idx_user_badges_user_id      ON user_badges(user_id);
CREATE INDEX idx_user_badges_badge_id     ON user_badges(badge_id);
CREATE INDEX idx_user_badges_earned_at    ON user_badges(earned_at DESC);

-- training_assignments
CREATE INDEX idx_training_assignments_user_id      ON training_assignments(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_training_assignments_dept_id      ON training_assignments(department_id) WHERE department_id IS NOT NULL;
CREATE INDEX idx_training_assignments_course_id    ON training_assignments(course_id);
CREATE INDEX idx_training_assignments_assigned_by  ON training_assignments(assigned_by);
CREATE INDEX idx_training_assignments_status       ON training_assignments(status);
CREATE INDEX idx_training_assignments_due_date     ON training_assignments(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_training_assignments_user_status  ON training_assignments(user_id, status) WHERE user_id IS NOT NULL;

-- phishing_campaigns
CREATE INDEX idx_phishing_campaigns_status      ON phishing_campaigns(status);
CREATE INDEX idx_phishing_campaigns_type        ON phishing_campaigns(type);
CREATE INDEX idx_phishing_campaigns_launched_by ON phishing_campaigns(launched_by);
CREATE INDEX idx_phishing_campaigns_launched_at ON phishing_campaigns(launched_at DESC);

-- phishing_targets
CREATE INDEX idx_phishing_targets_campaign_id ON phishing_targets(campaign_id);
CREATE INDEX idx_phishing_targets_user_id     ON phishing_targets(user_id);
CREATE INDEX idx_phishing_targets_clicked_at  ON phishing_targets(clicked_at) WHERE clicked_at IS NOT NULL;
CREATE INDEX idx_phishing_targets_reported_at ON phishing_targets(reported_at) WHERE reported_at IS NOT NULL;
-- Token lookups need to be fast
CREATE INDEX idx_phishing_targets_click_token  ON phishing_targets(click_token) WHERE click_token IS NOT NULL;
CREATE INDEX idx_phishing_targets_report_token ON phishing_targets(report_token) WHERE report_token IS NOT NULL;

-- phishing_templates
CREATE INDEX idx_phishing_templates_category   ON phishing_templates(category);
CREATE INDEX idx_phishing_templates_difficulty ON phishing_templates(difficulty);
CREATE INDEX idx_phishing_templates_is_active  ON phishing_templates(is_active);

-- audit_logs
CREATE INDEX idx_audit_logs_user_id      ON audit_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_audit_logs_action       ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource     ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at   ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_ip_address   ON audit_logs(ip_address) WHERE ip_address IS NOT NULL;
-- Composite for admin dashboard queries
CREATE INDEX idx_audit_logs_user_action_time ON audit_logs(user_id, action, created_at DESC) WHERE user_id IS NOT NULL;

-- notifications
CREATE INDEX idx_notifications_user_id    ON notifications(user_id);
CREATE INDEX idx_notifications_type       ON notifications(type);
CREATE INDEX idx_notifications_is_read    ON notifications(user_id, is_read) WHERE is_read = FALSE;
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- security_scores
CREATE INDEX idx_security_scores_user_id       ON security_scores(user_id);
CREATE INDEX idx_security_scores_calculated_at ON security_scores(calculated_at DESC);
CREATE INDEX idx_security_scores_user_time     ON security_scores(user_id, calculated_at DESC);

-- sessions
CREATE INDEX idx_sessions_user_id        ON sessions(user_id);
CREATE INDEX idx_sessions_expires_at     ON sessions(expires_at);
CREATE INDEX idx_sessions_is_revoked     ON sessions(is_revoked) WHERE is_revoked = FALSE;
CREATE INDEX idx_sessions_user_active    ON sessions(user_id, is_revoked) WHERE is_revoked = FALSE;

-- =============================================================================
-- TRIGGERS: auto-update updated_at
-- =============================================================================

CREATE OR REPLACE FUNCTION trigger_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

CREATE TRIGGER set_updated_at_users
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

CREATE TRIGGER set_updated_at_courses
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();

-- =============================================================================
-- VIEWS
-- =============================================================================

-- Leaderboard view: top users by security score
CREATE OR REPLACE VIEW v_leaderboard AS
SELECT
    u.id,
    u.display_name,
    u.avatar_url,
    d.name            AS department_name,
    u.security_score,
    COUNT(DISTINCT ub.badge_id)       AS badge_count,
    COUNT(DISTINCT c.id)              AS certificates_earned,
    RANK() OVER (ORDER BY u.security_score DESC) AS rank
FROM users u
LEFT JOIN departments  d  ON d.id = u.department_id
LEFT JOIN user_badges  ub ON ub.user_id = u.id
LEFT JOIN certificates c  ON c.user_id = u.id AND c.is_valid = TRUE
WHERE u.is_active = TRUE
GROUP BY u.id, u.display_name, u.avatar_url, d.name, u.security_score;

COMMENT ON VIEW v_leaderboard IS 'Ranked leaderboard of active users by security score';

-- Department compliance summary
CREATE OR REPLACE VIEW v_department_compliance AS
SELECT
    d.id,
    d.name,
    d.code,
    COUNT(DISTINCT u.id)                                          AS total_employees,
    COUNT(DISTINCT up.user_id) FILTER (WHERE up.status = 'completed') AS completed_users,
    ROUND(
        COUNT(DISTINCT up.user_id) FILTER (WHERE up.status = 'completed')::NUMERIC
        / NULLIF(COUNT(DISTINCT u.id), 0) * 100, 1
    )                                                             AS completion_rate_pct,
    AVG(u.security_score)::NUMERIC(5,1)                          AS avg_security_score
FROM departments d
LEFT JOIN users       u  ON u.department_id = d.id AND u.is_active = TRUE
LEFT JOIN user_progress up ON up.user_id = u.id
WHERE d.is_active = TRUE
GROUP BY d.id, d.name, d.code;

COMMENT ON VIEW v_department_compliance IS 'Aggregate compliance and score metrics per department';

-- User dashboard summary
CREATE OR REPLACE VIEW v_user_dashboard AS
SELECT
    u.id                                              AS user_id,
    u.display_name,
    u.role,
    u.security_score,
    d.name                                            AS department_name,
    COUNT(DISTINCT up.course_id) FILTER (WHERE up.status = 'completed') AS courses_completed,
    COUNT(DISTINCT up.course_id) FILTER (WHERE up.status = 'in_progress') AS courses_in_progress,
    COUNT(DISTINCT ta.id) FILTER (WHERE ta.status = 'pending')           AS pending_assignments,
    COUNT(DISTINCT ta.id) FILTER (WHERE ta.status = 'overdue')           AS overdue_assignments,
    COUNT(DISTINCT ub.badge_id)                       AS badges_earned,
    COUNT(DISTINCT c.id)                              AS certificates_earned
FROM users u
LEFT JOIN departments        d   ON d.id = u.department_id
LEFT JOIN user_progress      up  ON up.user_id = u.id
LEFT JOIN training_assignments ta ON ta.user_id = u.id
LEFT JOIN user_badges        ub  ON ub.user_id = u.id
LEFT JOIN certificates       c   ON c.user_id = u.id AND c.is_valid = TRUE
WHERE u.is_active = TRUE
GROUP BY u.id, u.display_name, u.role, u.security_score, d.name;

COMMENT ON VIEW v_user_dashboard IS 'Aggregated dashboard statistics per active user';
