-- 清理现有数据（开发环境使用）
DELETE FROM user_roles;
DELETE FROM users WHERE id IN (1, 2, 3);
DELETE FROM roles WHERE id IN (1, 2, 3);

-- 重置自增序列
ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE roles_id_seq RESTART WITH 1;

-- 插入测试角色
INSERT INTO roles (name, description, permissions) VALUES 
('ADMIN', '系统管理员', '{"users": ["create", "read", "update", "delete"], "courses": ["create", "read", "update", "delete"], "system": ["manage"]}'),
('INSTRUCTOR', '讲师', '{"courses": ["create", "read", "update"], "students": ["read"], "teaching": ["manage"]}'),
('STUDENT', '学员', '{"courses": ["read", "enroll"], "learning": ["track"], "profile": ["update"]}');

-- 插入测试用户
-- 所有测试用户的密码都是 "password123"
-- 使用 bcrypt 哈希值: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
INSERT INTO users (username, email, password_hash, first_name, last_name, department, position, is_active, email_verified) VALUES 
('admin', 'admin@contoso.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '系统', '管理员', 'IT部', '系统管理员', TRUE, TRUE),
('teacher', 'teacher@contoso.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '张', '老师', '培训部', '高级讲师', TRUE, TRUE),
('student', 'student@contoso.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '李', '学员', 'IT部', '软件工程师', TRUE, TRUE);

-- 分配角色给用户
INSERT INTO user_roles (user_id, role_id, assigned_by, assigned_at) VALUES 
(1, 1, 1, CURRENT_TIMESTAMP),  -- admin 用户 -> 管理员角色
(2, 2, 1, CURRENT_TIMESTAMP),  -- teacher 用户 -> 讲师角色
(3, 3, 1, CURRENT_TIMESTAMP);  -- student 用户 -> 学员角色

-- 插入一些测试课程分类
INSERT INTO categories (name, description, parent_id, display_order) VALUES 
('编程开发', '软件开发相关课程', NULL, 1),
('前端开发', '前端技术栈课程', 1, 1),
('后端开发', '后端技术栈课程', 1, 2),
('UI/UX设计', '界面和用户体验设计', NULL, 2),
('数据科学', '数据分析和机器学习', NULL, 3);

-- 插入一些测试课程
INSERT INTO courses (title, description, category_id, instructor_id, difficulty, duration_hours, thumbnail_url, is_published) VALUES 
('Vue.js 3 完整教程', '从零开始学习 Vue.js 3，包括组合式 API、路由、状态管理等核心概念', 2, 2, 'beginner', 20, 'https://via.placeholder.com/400x240/1890ff/ffffff?text=Vue.js', TRUE),
('TypeScript 从入门到精通', '学习 TypeScript 的类型系统，提升 JavaScript 开发效率', 2, 2, 'intermediate', 15, 'https://via.placeholder.com/400x240/3178c6/ffffff?text=TypeScript', TRUE),
('React 高级开发实战', '深入学习 React 高级特性，包括 Hooks、性能优化等', 2, 2, 'advanced', 25, 'https://via.placeholder.com/400x240/61dafb/000000?text=React', TRUE),
('Node.js 后端开发', '使用 Node.js 构建高性能的后端 API 服务', 3, 2, 'intermediate', 30, 'https://via.placeholder.com/400x240/339933/ffffff?text=Node.js', TRUE),
('UI/UX 设计基础', '学习现代 UI/UX 设计原理和设计系统', 4, 2, 'beginner', 18, 'https://via.placeholder.com/400x240/ff6b6b/ffffff?text=Design', TRUE);

-- 为测试用户添加一些课程注册记录
INSERT INTO enrollments (user_id, course_id, enrolled_at, progress, status) VALUES 
(3, 1, CURRENT_TIMESTAMP - INTERVAL '30 days', 65, 'active'),
(3, 2, CURRENT_TIMESTAMP - INTERVAL '15 days', 45, 'active'),
(3, 3, CURRENT_TIMESTAMP - INTERVAL '5 days', 30, 'active'),
(3, 4, CURRENT_TIMESTAMP - INTERVAL '60 days', 100, 'completed'),
(3, 5, CURRENT_TIMESTAMP - INTERVAL '45 days', 100, 'completed');

-- 显示插入的测试数据
SELECT 
    u.username,
    u.first_name || ' ' || u.last_name as full_name,
    u.email,
    r.name as role,
    u.department,
    u.position
FROM users u
JOIN user_roles ur ON u.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
WHERE u.username IN ('admin', 'teacher', 'student')
ORDER BY u.id;
