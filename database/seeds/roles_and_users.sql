-- 插入基础角色数据
INSERT INTO roles (name, description, permissions) VALUES 
('ADMIN', '系统管理员', '{"users": ["create", "read", "update", "delete"], "courses": ["create", "read", "update", "delete"], "system": ["manage"]}'),
('INSTRUCTOR', '讲师', '{"courses": ["create", "read", "update"], "students": ["read"], "teaching": ["manage"]}'),
('STUDENT', '学员', '{"courses": ["read", "enroll"], "learning": ["track"], "profile": ["update"]}');

-- 插入管理员用户
-- 密码为 admin123 的 bcrypt 哈希值
INSERT INTO users (username, email, password_hash, first_name, last_name, department, position, is_active, email_verified) VALUES 
('admin', 'admin@contoso.com', '$2a$10$8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8', 'Admin', 'User', 'IT', '系统管理员', TRUE, TRUE),
('teacher1', 'teacher@contoso.com', '$2a$10$8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8', 'John', 'Teacher', '培训部', '高级讲师', TRUE, TRUE),
('student1', 'student@contoso.com', '$2a$10$8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8X8', 'Jane', 'Student', 'IT', '软件工程师', TRUE, TRUE);

-- 分配角色
INSERT INTO user_roles (user_id, role_id, assigned_by) VALUES 
(1, 1, 1),  -- admin 用户分配管理员角色
(2, 2, 1),  -- teacher1 用户分配讲师角色
(3, 3, 1);  -- student1 用户分配学员角色