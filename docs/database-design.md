# 数据库设计 - E-Learning Platform

## 概述

本文档描述了 Contoso.tech 企业在线培训平台的数据库设计，包含核心实体、关系以及数据库表结构。

## 数据库选择

- **主数据库**: MySQL 8.0 / PostgreSQL 14+
- **字符编码**: UTF-8
- **时区**: UTC

## 核心实体关系图 (ERD)

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Users    │    │   Roles     │    │ User_Roles  │
│             │    │             │    │             │
│ id (PK)     │    │ id (PK)     │    │ user_id (FK)│
│ username    │◄───┤ name        │◄───┤ role_id (FK)│
│ email       │    │ description │    │             │
│ password    │    │ created_at  │    └─────────────┘
│ first_name  │    │ updated_at  │
│ last_name   │    └─────────────┘
│ avatar_url  │
│ created_at  │
│ updated_at  │
│ is_active   │
└─────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Categories  │    │   Courses   │    │   Lessons   │
│             │    │             │    │             │
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ name        │◄───┤ title       │◄───┤ title       │
│ description │    │ description │    │ content     │
│ parent_id   │    │ category_id │    │ course_id   │
│ sort_order  │    │ instructor_id│    │ sort_order  │
│ created_at  │    │ duration    │    │ duration    │
│ updated_at  │    │ difficulty  │    │ lesson_type │
│ is_active   │    │ cover_image │    │ video_url   │
└─────────────┘    │ is_published│    │ created_at  │
                   │ created_at  │    │ updated_at  │
                   │ updated_at  │    │ is_active   │
                   └─────────────┘    └─────────────┘

┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Enrollments │    │User_Progress│    │Course_Completed│
│             │    │             │    │             │
│ id (PK)     │    │ id (PK)     │    │ id (PK)     │
│ user_id (FK)│    │ user_id (FK)│    │ user_id (FK)│
│ course_id   │    │ lesson_id   │    │ course_id   │
│ enrolled_at │    │ progress_pct│    │ completed_at│
│ status      │    │ completed_at│    │ certificate │
│ progress    │    │ time_spent  │    └─────────────┘
└─────────────┘    │ last_accessed│
                   └─────────────┘
```

## 数据表结构

### 1. 用户表 (users)

```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    avatar_url VARCHAR(255) DEFAULT NULL,
    phone VARCHAR(20) DEFAULT NULL,
    department VARCHAR(100) DEFAULT NULL,
    position VARCHAR(100) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active)
);
```

### 2. 角色表 (roles)

```sql
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) DEFAULT NULL,
    permissions JSON DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 初始化基础角色
INSERT INTO roles (name, description) VALUES 
('ADMIN', '系统管理员'),
('INSTRUCTOR', '讲师'),
('STUDENT', '学员');
```

### 3. 用户角色关联表 (user_roles)

```sql
CREATE TABLE user_roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    role_id INT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    assigned_by BIGINT DEFAULT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE KEY unique_user_role (user_id, role_id)
);
```

### 4. 课程分类表 (categories)

```sql
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT DEFAULT NULL,
    parent_id INT DEFAULT NULL,
    sort_order INT DEFAULT 0,
    icon VARCHAR(100) DEFAULT NULL,
    color VARCHAR(7) DEFAULT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_parent_id (parent_id),
    INDEX idx_sort_order (sort_order),
    INDEX idx_is_active (is_active)
);
```

### 5. 课程表 (courses)

```sql
CREATE TABLE courses (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT DEFAULT NULL,
    category_id INT NOT NULL,
    instructor_id BIGINT NOT NULL,
    duration_minutes INT DEFAULT 0,
    difficulty_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') DEFAULT 'BEGINNER',
    cover_image VARCHAR(255) DEFAULT NULL,
    prerequisites TEXT DEFAULT NULL,
    learning_objectives TEXT DEFAULT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    max_students INT DEFAULT 0,
    price DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE RESTRICT,
    FOREIGN KEY (instructor_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_category_id (category_id),
    INDEX idx_instructor_id (instructor_id),
    INDEX idx_is_published (is_published),
    INDEX idx_created_at (created_at)
);
```

### 6. 课程章节表 (lessons)

```sql
CREATE TABLE lessons (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    course_id BIGINT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content LONGTEXT DEFAULT NULL,
    sort_order INT DEFAULT 0,
    duration_minutes INT DEFAULT 0,
    lesson_type ENUM('VIDEO', 'TEXT', 'DOCUMENT', 'QUIZ') DEFAULT 'TEXT',
    video_url VARCHAR(255) DEFAULT NULL,
    document_url VARCHAR(255) DEFAULT NULL,
    is_preview BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    INDEX idx_course_id (course_id),
    INDEX idx_sort_order (sort_order),
    INDEX idx_is_active (is_active)
);
```

### 7. 课程注册表 (enrollments)

```sql
CREATE TABLE enrollments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ACTIVE', 'COMPLETED', 'DROPPED', 'SUSPENDED') DEFAULT 'ACTIVE',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    last_accessed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE KEY unique_enrollment (user_id, course_id),
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id),
    INDEX idx_status (status)
);
```

### 8. 学习进度表 (user_lesson_progress)

```sql
CREATE TABLE user_lesson_progress (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    lesson_id BIGINT NOT NULL,
    enrollment_id BIGINT NOT NULL,
    status ENUM('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED') DEFAULT 'NOT_STARTED',
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    time_spent_minutes INT DEFAULT 0,
    first_accessed_at TIMESTAMP NULL,
    last_accessed_at TIMESTAMP NULL,
    completed_at TIMESTAMP NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (lesson_id) REFERENCES lessons(id) ON DELETE CASCADE,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_lesson (user_id, lesson_id),
    INDEX idx_user_id (user_id),
    INDEX idx_lesson_id (lesson_id),
    INDEX idx_enrollment_id (enrollment_id),
    INDEX idx_status (status)
);
```

### 9. 课程完成记录表 (course_completions)

```sql
CREATE TABLE course_completions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    enrollment_id BIGINT NOT NULL,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    final_score DECIMAL(5,2) DEFAULT NULL,
    certificate_url VARCHAR(255) DEFAULT NULL,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    UNIQUE KEY unique_completion (user_id, course_id),
    INDEX idx_user_id (user_id),
    INDEX idx_course_id (course_id),
    INDEX idx_completed_at (completed_at)
);
```

## 数据库索引策略

### 主要索引
- 所有主键自动创建聚集索引
- 外键字段创建非聚集索引
- 经常查询的字段创建复合索引

### 查询优化索引
- `users`: `(is_active, created_at)`
- `courses`: `(is_published, category_id, created_at)`
- `enrollments`: `(user_id, status, enrolled_at)`
- `user_lesson_progress`: `(user_id, status, last_accessed_at)`

## 数据库配置

### 连接池配置
```properties
# 最小连接数
spring.datasource.hikari.minimum-idle=5
# 最大连接数
spring.datasource.hikari.maximum-pool-size=20
# 连接超时时间
spring.datasource.hikari.connection-timeout=30000
# 最大生命周期
spring.datasource.hikari.max-lifetime=1800000
```

### 备份策略
- 每日全量备份
- 每小时增量备份
- 保留30天备份数据
- 异地备份存储

## 数据迁移和版本控制

### Flyway 迁移脚本示例
```sql
-- V1__Initial_schema.sql
-- V2__Add_user_department.sql
-- V3__Add_course_prerequisites.sql
```

### 数据种子 (Seeds)
- 默认管理员账户
- 基础角色数据
- 示例课程分类
- 测试课程数据