-- 插入课程分类数据
INSERT INTO categories (name, description, parent_id, sort_order, icon, color, is_active) VALUES 
-- 一级分类
('编程开发', '软件开发相关技术课程', NULL, 1, 'code', '#3B82F6', TRUE),
('产品设计', '产品设计和用户体验课程', NULL, 2, 'design', '#10B981', TRUE),
('项目管理', '项目管理和团队协作课程', NULL, 3, 'project', '#F59E0B', TRUE),
('数据分析', '数据科学和分析相关课程', NULL, 4, 'chart', '#8B5CF6', TRUE),
('软技能', '沟通协作和职业发展课程', NULL, 5, 'people', '#EF4444', TRUE);

-- 编程开发子分类
INSERT INTO categories (name, description, parent_id, sort_order, icon, color, is_active) VALUES 
('前端开发', 'HTML, CSS, JavaScript 等前端技术', 1, 1, 'laptop', '#3B82F6', TRUE),
('后端开发', 'Java, Python, Node.js 等后端技术', 1, 2, 'server', '#1E40AF', TRUE),
('移动开发', 'iOS, Android 移动应用开发', 1, 3, 'mobile', '#0EA5E9', TRUE),
('数据库', 'MySQL, PostgreSQL, MongoDB 等数据库技术', 1, 4, 'database', '#0F766E', TRUE);

-- 产品设计子分类
INSERT INTO categories (name, description, parent_id, sort_order, icon, color, is_active) VALUES 
('UI设计', '用户界面设计原理和工具', 2, 1, 'palette', '#10B981', TRUE),
('UX设计', '用户体验设计方法和实践', 2, 2, 'users', '#059669', TRUE),
('产品思维', '产品规划和策略制定', 2, 3, 'lightbulb', '#047857', TRUE);

-- 项目管理子分类
INSERT INTO categories (name, description, parent_id, sort_order, icon, color, is_active) VALUES 
('敏捷开发', 'Scrum, Kanban 等敏捷方法', 3, 1, 'refresh', '#F59E0B', TRUE),
('团队协作', '团队管理和协作工具', 3, 2, 'team', '#D97706', TRUE);