-- E-Learning Platform Database Schema
-- Created for Contoso.tech Enterprise Training Platform
-- MySQL 8.0+

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ============================================================================
-- Table: users
-- Description: 用户基础信息表
-- ============================================================================
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) UNIQUE NOT NULL COMMENT '用户名',
    email VARCHAR(100) UNIQUE NOT NULL COMMENT '邮箱地址',
    password_hash VARCHAR(255) NOT NULL COMMENT '密码哈希',
    first_name VARCHAR(50) NOT NULL COMMENT '名',
    last_name VARCHAR(50) NOT NULL COMMENT '姓',
    avatar_url VARCHAR(255) DEFAULT NULL COMMENT '头像URL',
    phone VARCHAR(20) DEFAULT NULL COMMENT '手机号码',
    department VARCHAR(100) DEFAULT NULL COMMENT '部门',
    position VARCHAR(100) DEFAULT NULL COMMENT '职位',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    email_verified BOOLEAN DEFAULT FALSE COMMENT '邮箱是否验证',
    last_login_at TIMESTAMP NULL COMMENT '最后登录时间',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户信息表';

-- ============================================================================
-- Table: roles
-- Description: 角色表
-- ============================================================================
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '角色ID',
    name VARCHAR(50) UNIQUE NOT NULL COMMENT '角色名称',
    description VARCHAR(255) DEFAULT NULL COMMENT '角色描述',
    permissions JSON DEFAULT NULL COMMENT '权限JSON',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='角色表';

-- ============================================================================
-- Table: user_roles
-- Description: 用户角色关联表
-- ============================================================================
CREATE TABLE user_roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '关联ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    role_id INT NOT NULL COMMENT '角色ID',
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '分配时间',
    assigned_by BIGINT DEFAULT NULL COMMENT '分配人ID',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_role (user_id, role_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户角色关联表';

-- ============================================================================
-- Table: categories
-- Description: 课程分类表
-- ============================================================================
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '分类ID',
    name VARCHAR(100) NOT NULL COMMENT '分类名称',
    description TEXT DEFAULT NULL COMMENT '分类描述',
    parent_id INT DEFAULT NULL COMMENT '父分类ID',
    sort_order INT DEFAULT 0 COMMENT '排序顺序',
    icon VARCHAR(100) DEFAULT NULL COMMENT '图标',
    color VARCHAR(7) DEFAULT NULL COMMENT '颜色',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_parent_id (parent_id),
    INDEX idx_sort_order (sort_order),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程分类表';

-- ============================================================================
-- Table: courses
-- Description: 课程信息表
-- ============================================================================
CREATE TABLE courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '课程ID',
    title VARCHAR(200) NOT NULL COMMENT '课程标题',
    description TEXT DEFAULT NULL COMMENT '课程描述',
    category_id INT NOT NULL COMMENT '分类ID',
    instructor_id BIGINT NOT NULL COMMENT '讲师ID',
    duration_minutes INT DEFAULT 0 COMMENT '课程时长(分钟)',
    difficulty_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') DEFAULT 'BEGINNER' COMMENT '难度级别',
    cover_image VARCHAR(255) DEFAULT NULL COMMENT '封面图片',
    prerequisites TEXT DEFAULT NULL COMMENT '先修要求',
    learning_objectives TEXT DEFAULT NULL COMMENT '学习目标',
    is_published BOOLEAN DEFAULT FALSE COMMENT '是否发布',
    max_students INT DEFAULT 0 COMMENT '最大学员数',
    price DECIMAL(10,2) DEFAULT 0.00 COMMENT '课程价格',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_category_id (category_id),
    INDEX idx_instructor_id (instructor_id),
    INDEX idx_is_published (is_published),
    INDEX idx_created_at (created_at),
    INDEX idx_difficulty_level (difficulty_level)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程信息表';

-- ============================================================================
-- Table: lessons
-- Description: 课程章节表
-- ============================================================================
CREATE TABLE lessons (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '章节ID',
    course_id BIGINT NOT NULL COMMENT '课程ID',
    title VARCHAR(200) NOT NULL COMMENT '章节标题',
    content LONGTEXT DEFAULT NULL COMMENT '章节内容',
    sort_order INT DEFAULT 0 COMMENT '排序顺序',
    duration_minutes INT DEFAULT 0 COMMENT '章节时长(分钟)',
    lesson_type ENUM('VIDEO', 'TEXT', 'DOCUMENT', 'QUIZ') DEFAULT 'TEXT' COMMENT '章节类型',
    video_url VARCHAR(255) DEFAULT NULL COMMENT '视频URL',
    document_url VARCHAR(255) DEFAULT NULL COMMENT '文档URL',
    is_preview BOOLEAN DEFAULT FALSE COMMENT '是否预览',
    is_active BOOLEAN DEFAULT TRUE COMMENT '是否激活',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id),
    INDEX idx_sort_order (sort_order),
    INDEX idx_is_active (is_active),
    INDEX idx_lesson_type (lesson_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程章节表';

-- ============================================================================
-- Table: enrollments
-- Description: 课程注册表
-- ============================================================================
CREATE TABLE enrollments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '注册ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    course_id BIGINT NOT NULL COMMENT '课程ID',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '注册时间',
    status ENUM('ACTIVE', 'COMPLETED', 'DROPPED', 'SUSPENDED') DEFAULT 'ACTIVE' COMMENT '状态',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00 COMMENT '进度百分比',
    last_accessed_at TIMESTAMP NULL COMMENT '最后访问时间',
    completed_at TIMESTAMP NULL COMMENT '完成时间',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (user_id, course_id),
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id),
    INDEX idx_status (status),
    INDEX idx_enrolled_at (enrolled_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程注册表';

-- ============================================================================
-- Table: user_lesson_progress
-- Description: 用户章节学习进度表
-- ============================================================================
CREATE TABLE user_lesson_progress (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '进度ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    lesson_id BIGINT NOT NULL COMMENT '章节ID',
    enrollment_id BIGINT NOT NULL COMMENT '注册ID',
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'NOT_STARTED' COMMENT '状态',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00 COMMENT '进度百分比',
    time_spent_minutes INT DEFAULT 0 COMMENT '学习时长(分钟)',
    first_accessed_at TIMESTAMP NULL COMMENT '首次访问时间',
    last_accessed_at TIMESTAMP NULL COMMENT '最后访问时间',
    completed_at TIMESTAMP NULL COMMENT '完成时间',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id),
    INDEX idx_user_id (user_id),
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_enrollment_id (enrollment_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户章节学习进度表';

-- ============================================================================
-- Table: course_completions
-- Description: 课程完成记录表
-- ============================================================================
CREATE TABLE course_completions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT COMMENT '完成记录ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    course_id BIGINT NOT NULL COMMENT '课程ID',
    enrollment_id BIGINT NOT NULL COMMENT '注册ID',
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '完成时间',
    final_score DECIMAL(5,2) DEFAULT NULL COMMENT '最终得分',
    certificate_url VARCHAR(255) DEFAULT NULL COMMENT '证书URL',
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_completion (user_id, course_id),
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id),
    INDEX idx_completed_at (completed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='课程完成记录表';

SET FOREIGN_KEY_CHECKS = 1;