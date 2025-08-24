# API 设计文档 - E-Learning Platform

## 概述

本文档描述了 Contoso.tech 企业在线培训平台的 RESTful API 设计，包含所有核心功能的接口定义。

## API 基础信息

- **Base URL**: `https://api.contoso-learning.com/v1`
- **协议**: HTTPS
- **认证方式**: JWT Token
- **数据格式**: JSON
- **编码**: UTF-8

## 通用规范

### HTTP 状态码
- `200` - 成功
- `201` - 创建成功
- `400` - 请求参数错误
- `401` - 未授权
- `403` - 禁止访问
- `404` - 资源不存在
- `422` - 验证失败
- `500` - 服务器内部错误

### 统一响应格式
```json
{
    "success": true,
    "message": "操作成功",
    "data": {},
    "timestamp": "2024-01-01T00:00:00Z",
    "request_id": "uuid"
}
```

### 错误响应格式
```json
{
    "success": false,
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "输入数据验证失败",
        "details": [
            {
                "field": "email",
                "message": "邮箱格式不正确"
            }
        ]
    },
    "timestamp": "2024-01-01T00:00:00Z",
    "request_id": "uuid"
}
```

### 分页响应格式
```json
{
    "success": true,
    "data": {
        "items": [],
        "pagination": {
            "page": 1,
            "size": 20,
            "total": 100,
            "pages": 5,
            "has_next": true,
            "has_prev": false
        }
    }
}
```

## 认证 API

### 用户注册
```http
POST /auth/register
Content-Type: application/json

{
    "username": "john_doe",
    "email": "john@contoso.com",
    "password": "SecurePassword123",
    "first_name": "John",
    "last_name": "Doe",
    "department": "IT",
    "position": "Developer"
}
```

**响应**:
```json
{
    "success": true,
    "message": "注册成功",
    "data": {
        "user": {
            "id": 1,
            "username": "john_doe",
            "email": "john@contoso.com",
            "first_name": "John",
            "last_name": "Doe",
            "avatar_url": null,
            "roles": ["STUDENT"]
        }
    }
}
```

### 用户登录
```http
POST /auth/login
Content-Type: application/json

{
    "username": "john_doe",
    "password": "SecurePassword123"
}
```

**响应**:
```json
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "expires_in": 3600,
        "user": {
            "id": 1,
            "username": "john_doe",
            "email": "john@contoso.com",
            "first_name": "John",
            "last_name": "Doe",
            "roles": ["STUDENT"]
        }
    }
}
```

### 刷新令牌
```http
POST /auth/refresh
Authorization: Bearer {token}
```

### 登出
```http
POST /auth/logout
Authorization: Bearer {token}
```

## 用户管理 API

### 获取当前用户信息
```http
GET /users/profile
Authorization: Bearer {token}
```

### 更新用户资料
```http
PUT /users/profile
Authorization: Bearer {token}
Content-Type: application/json

{
    "first_name": "John",
    "last_name": "Doe",
    "department": "IT",
    "position": "Senior Developer",
    "phone": "+1234567890"
}
```

### 上传头像
```http
POST /users/avatar
Authorization: Bearer {token}
Content-Type: multipart/form-data

avatar: [file]
```

### 修改密码
```http
PUT /users/password
Authorization: Bearer {token}
Content-Type: application/json

{
    "current_password": "OldPassword123",
    "new_password": "NewPassword123"
}
```

## 课程管理 API

### 获取课程列表
```http
GET /courses?page=1&size=20&category_id=1&difficulty=BEGINNER&search=java
Authorization: Bearer {token}
```

**响应**:
```json
{
    "success": true,
    "data": {
        "items": [
            {
                "id": 1,
                "title": "Java 基础编程",
                "description": "Java 编程入门课程",
                "category": {
                    "id": 1,
                    "name": "编程语言"
                },
                "instructor": {
                    "id": 2,
                    "name": "张老师",
                    "avatar_url": "/avatars/teacher1.jpg"
                },
                "duration_minutes": 480,
                "difficulty_level": "BEGINNER",
                "cover_image": "/images/course1.jpg",
                "is_enrolled": false,
                "student_count": 156,
                "rating": 4.5,
                "created_at": "2024-01-01T00:00:00Z"
            }
        ],
        "pagination": {
            "page": 1,
            "size": 20,
            "total": 50,
            "pages": 3
        }
    }
}
```

### 获取课程详情
```http
GET /courses/{id}
Authorization: Bearer {token}
```

### 创建课程 (管理员/讲师)
```http
POST /courses
Authorization: Bearer {token}
Content-Type: application/json

{
    "title": "Vue.js 3.x 实战开发",
    "description": "学习 Vue.js 3.x 的核心概念和实战应用",
    "category_id": 1,
    "duration_minutes": 600,
    "difficulty_level": "INTERMEDIATE",
    "prerequisites": "HTML, CSS, JavaScript 基础",
    "learning_objectives": "掌握 Vue.js 3.x 组件开发、状态管理等"
}
```

### 更新课程
```http
PUT /courses/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "title": "Vue.js 3.x 实战开发 (更新版)",
    "description": "更新的课程描述"
}
```

### 发布/取消发布课程
```http
PATCH /courses/{id}/publish
Authorization: Bearer {token}
Content-Type: application/json

{
    "is_published": true
}
```

## 课程分类 API

### 获取分类列表
```http
GET /categories
Authorization: Bearer {token}
```

**响应**:
```json
{
    "success": true,
    "data": [
        {
            "id": 1,
            "name": "编程语言",
            "description": "各种编程语言学习",
            "parent_id": null,
            "children": [
                {
                    "id": 2,
                    "name": "前端开发",
                    "parent_id": 1
                },
                {
                    "id": 3,
                    "name": "后端开发", 
                    "parent_id": 1
                }
            ],
            "course_count": 25
        }
    ]
}
```

## 课程章节 API

### 获取课程章节列表
```http
GET /courses/{course_id}/lessons
Authorization: Bearer {token}
```

### 获取章节详情
```http
GET /lessons/{id}
Authorization: Bearer {token}
```

### 创建课程章节
```http
POST /courses/{course_id}/lessons
Authorization: Bearer {token}
Content-Type: application/json

{
    "title": "第一章：Vue.js 介绍",
    "content": "Vue.js 是一个用于构建用户界面的渐进式框架...",
    "sort_order": 1,
    "duration_minutes": 30,
    "lesson_type": "TEXT",
    "is_preview": false
}
```

## 学习功能 API

### 注册课程
```http
POST /enrollments
Authorization: Bearer {token}
Content-Type: application/json

{
    "course_id": 1
}
```

### 获取我的课程
```http
GET /enrollments/my-courses?status=ACTIVE&page=1&size=20
Authorization: Bearer {token}
```

### 获取学习进度
```http
GET /enrollments/{enrollment_id}/progress
Authorization: Bearer {token}
```

**响应**:
```json
{
    "success": true,
    "data": {
        "enrollment": {
            "id": 1,
            "course": {
                "id": 1,
                "title": "Java 基础编程"
            },
            "progress_percentage": 65.5,
            "status": "ACTIVE",
            "enrolled_at": "2024-01-01T00:00:00Z",
            "last_accessed_at": "2024-01-15T10:30:00Z"
        },
        "lessons": [
            {
                "id": 1,
                "title": "第一章：Java 介绍",
                "status": "COMPLETED",
                "progress_percentage": 100,
                "completed_at": "2024-01-02T14:20:00Z"
            },
            {
                "id": 2,
                "title": "第二章：变量和数据类型",
                "status": "IN_PROGRESS",
                "progress_percentage": 45,
                "last_accessed_at": "2024-01-15T10:30:00Z"
            }
        ]
    }
}
```

### 更新学习进度
```http
PUT /user-progress/lessons/{lesson_id}
Authorization: Bearer {token}
Content-Type: application/json

{
    "progress_percentage": 75,
    "time_spent_minutes": 25
}
```

### 标记章节完成
```http
POST /user-progress/lessons/{lesson_id}/complete
Authorization: Bearer {token}
```

### 标记课程完成
```http
POST /enrollments/{enrollment_id}/complete
Authorization: Bearer {token}
```

## 管理员 API

### 获取用户列表
```http
GET /admin/users?page=1&size=20&role=STUDENT&search=john
Authorization: Bearer {token}
```

### 分配用户角色
```http
POST /admin/users/{user_id}/roles
Authorization: Bearer {token}
Content-Type: application/json

{
    "role_id": 2
}
```

### 获取系统统计
```http
GET /admin/statistics
Authorization: Bearer {token}
```

**响应**:
```json
{
    "success": true,
    "data": {
        "total_users": 1250,
        "total_courses": 85,
        "total_enrollments": 3420,
        "active_students": 890,
        "courses_completed": 1156,
        "popular_courses": [
            {
                "id": 1,
                "title": "Java 基础编程",
                "enrollment_count": 234
            }
        ]
    }
}
```

## WebSocket API (实时功能)

### 连接学习会话
```javascript
// 连接到学习会话
const socket = new WebSocket('ws://localhost:8080/ws/learning');

// 发送心跳
socket.send(JSON.stringify({
    type: 'HEARTBEAT',
    lesson_id: 1,
    timestamp: Date.now()
}));

// 接收进度更新
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.type === 'PROGRESS_UPDATE') {
        // 处理进度更新
    }
};
```

## 文件上传 API

### 上传课程封面
```http
POST /upload/course-cover
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [image file]
course_id: 1
```

### 上传课程视频
```http
POST /upload/lesson-video
Authorization: Bearer {token}
Content-Type: multipart/form-data

file: [video file]
lesson_id: 1
```

## API 限流和安全

### 速率限制
- 登录接口：每分钟最多 5 次尝试
- 注册接口：每小时最多 3 次
- 一般接口：每分钟 100 次请求
- 上传接口：每分钟 10 次

### 安全措施
- JWT Token 过期时间：1小时
- 密码复杂度要求：至少8位，包含字母和数字
- 文件上传类型限制：图片(jpg,png,gif)，视频(mp4,webm)
- 文件大小限制：图片最大2MB，视频最大100MB

## API 版本控制

### URL版本控制
```
/v1/courses  # 当前版本
/v2/courses  # 新版本
```

### Header版本控制
```http
Accept: application/vnd.contoso.v1+json
```