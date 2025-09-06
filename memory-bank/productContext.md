# 产品上下文 - Contoso.tech 企业在线培训平台

## 项目概述

Contoso.tech 企业在线培训平台是一个为企业提供完整在线学习解决方案的现代化 Web 应用程序。该平台采用前后端分离的架构设计，提供用户友好的界面和强大的管理功能，帮助企业构建高效的内部培训体系。

## 核心功能

### 用户管理系统
- 用户注册与登录
- 基于角色的权限控制 (学员、讲师、管理员)
- 个人资料管理
- 密码重置和安全验证

### 课程管理系统
- 课程创建、编辑和发布
- 多级课程分类管理
- 课程内容管理 (文档、视频、测试)
- 课程状态跟踪

### 学习功能
- 课程浏览和搜索
- 实时学习进度跟踪
- 课程完成认证
- 学习历史记录

### 响应式设计
- 现代化 UI/UX 设计
- 移动端友好
- 多设备适配

## 系统架构

### 整体架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │◄───│   CDN/Nginx     │◄───│   Vue.js 3.x    │
│                 │    │                 │    │   Frontend      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                                        │
                                                        │ HTTP/REST API
                                                        ▼
                              ┌─────────────────────────────────────┐
                              │        Load Balancer               │
                              └─────────────────────────────────────┘
                                              │
                                              ▼
                              ┌─────────────────────────────────────┐
                              │      Spring Boot Application       │
                              │         (Java Backend)              │
                              └─────────────────────────────────────┘
                                              │
                                              ▼
                              ┌─────────────────────────────────────┐
                              │       Database Layer               │
                              │     (MySQL/PostgreSQL)             │
                              └─────────────────────────────────────┘
```

### AKS 部署架构
```
GitHub Repository → GitHub Actions → Azure Container Registry → AKS Cluster
                                                                    │
                                                                    ▼
                                                        Namespace: elearning
                                                                    │
                                                                    ▼
                 ┌───────────────────────────────────────────────────────────────────────┐
                 │                                                                       │
                 ▼                                                                       ▼
      Frontend Deployment                                           Backend Deployment (Future)
           │                                                                │
           ▼                                                                ▼
    Frontend Service                                                 Backend Service
           │                                                                │
           ▼                                                                ▼
Application Gateway Ingress                                          Database Connection
```

## 技术栈

### 前端技术
- **框架**: Vue.js 3.x
- **构建工具**: Vite
- **UI 组件**: Ant Design Vue
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **样式**: SCSS

### 后端技术
- **框架**: Spring Boot 3.x
- **语言**: Java 17+
- **安全**: Spring Security + JWT
- **数据库**: MySQL 8.0
- **ORM**: Spring Data JPA
- **构建工具**: Maven
- **API 文档**: OpenAPI 3.0

### 基础设施
- **容器化**: Docker & Docker Compose
- **代理服务器**: Nginx
- **数据库**: MySQL
- **部署**: Azure Kubernetes Service (AKS)
- **CI/CD**: GitHub Actions

## 模块划分

### 用户管理模块 (User Management)
- 用户注册与登录
- 角色权限管理
- 个人资料管理
- 密码重置

### 课程管理模块 (Course Management)
- 课程创建与编辑
- 课程分类管理
- 课程内容管理
- 课程发布状态管理

### 学习模块 (Learning Module)
- 课程浏览
- 学习进度跟踪
- 课程完成标记
- 学习记录

### 系统管理模块 (System Management)
- 系统配置
- 用户管理
- 数据统计 (基础版本)

## 项目路线图

### v1.0.0 (当前版本 - MVP)
- ✅ 基础用户管理
- ✅ 课程管理系统
- ✅ 学习功能
- ✅ 响应式UI设计

### v1.1.0 (计划中)
- 🔄 高级搜索功能
- 🔄 课程评价系统
- 🔄 学习统计分析
- 🔄 移动端优化

### v2.0.0 (长期规划)
- 📋 视频会议集成
- 📋 AI 智能推荐
- 📋 多语言支持
- 📋 社交学习功能

## 部署环境

### 开发环境
- 本地开发环境
- 开发服务器 (dev.contoso.tech)
- Docker Compose 部署

### 测试环境
- 测试服务器 (test.contoso.tech)
- Azure Kubernetes Service (AKS)
- 持续集成测试

### 生产环境
- 生产服务器 (learn.contoso.tech)
- Azure Kubernetes Service (AKS)
- 高可用性配置
- 多区域部署 (未来)
