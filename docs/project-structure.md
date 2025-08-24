# 项目结构设计 - E-Learning Platform

## 概述

本文档定义了 Contoso.tech 企业在线培训平台的项目目录结构，包含前端、后端、文档和部署配置的组织方式。

## 项目根目录结构

```
e-learning/
├── README.md                     # 项目说明文档
├── .gitignore                    # Git 忽略配置
├── docker-compose.yml            # Docker 编排配置
├── .env.example                  # 环境变量示例
├── docs/                         # 项目文档
│   ├── architecture.md           # 系统架构设计
│   ├── database-design.md        # 数据库设计
│   ├── api-design.md             # API 设计文档
│   ├── frontend-design.md        # 前端设计文档
│   ├── deployment.md             # 部署指南
│   └── development-setup.md      # 开发环境搭建
├── frontend/                     # Vue.js 前端项目
├── backend/                      # Spring Boot 后端项目
├── database/                     # 数据库相关文件
│   ├── migrations/               # 数据库迁移脚本
│   ├── seeds/                    # 初始化数据
│   └── schema.sql                # 数据库架构
├── deployment/                   # 部署配置
│   ├── kubernetes/               # K8s 配置文件
│   ├── docker/                   # Docker 配置文件
│   └── nginx/                    # Nginx 配置
└── scripts/                      # 构建和部署脚本
    ├── build.sh                  # 构建脚本
    ├── deploy.sh                 # 部署脚本
    └── dev-setup.sh              # 开发环境搭建
```

## 前端项目结构 (Vue.js)

```
frontend/
├── package.json                  # 项目依赖配置
├── vite.config.js               # Vite 构建配置
├── index.html                   # HTML 入口文件
├── .env.development             # 开发环境变量
├── .env.production              # 生产环境变量
├── public/                      # 静态资源
│   ├── favicon.ico
│   ├── logo.png
│   └── images/
├── src/                         # 源代码目录
│   ├── main.js                  # 应用入口文件
│   ├── App.vue                  # 根组件
│   ├── router/                  # 路由配置
│   │   ├── index.js             # 路由主配置
│   │   └── guards.js            # 路由守卫
│   ├── stores/                  # Pinia 状态管理
│   │   ├── index.js             # Store 主配置
│   │   ├── user.js              # 用户状态
│   │   ├── course.js            # 课程状态
│   │   └── learning.js          # 学习状态
│   ├── views/                   # 页面组件
│   │   ├── auth/                # 认证相关页面
│   │   │   ├── LoginPage.vue
│   │   │   ├── RegisterPage.vue
│   │   │   └── ForgotPassword.vue
│   │   ├── dashboard/           # 主页面
│   │   │   └── DashboardPage.vue
│   │   ├── courses/             # 课程相关页面
│   │   │   ├── CourseCatalog.vue
│   │   │   ├── CourseDetails.vue
│   │   │   └── LearningPage.vue
│   │   ├── profile/             # 个人中心
│   │   │   ├── ProfilePage.vue
│   │   │   └── SettingsPage.vue
│   │   └── admin/               # 管理员页面
│   │       ├── UserManagement.vue
│   │       ├── CourseManagement.vue
│   │       └── Statistics.vue
│   ├── components/              # 可复用组件
│   │   ├── common/              # 通用组件
│   │   │   ├── TheHeader.vue
│   │   │   ├── TheSidebar.vue
│   │   │   ├── TheFooter.vue
│   │   │   ├── LoadingSpinner.vue
│   │   │   ├── ErrorMessage.vue
│   │   │   └── ConfirmDialog.vue
│   │   ├── course/              # 课程相关组件
│   │   │   ├── CourseCard.vue
│   │   │   ├── CourseFilters.vue
│   │   │   ├── CourseCurriculum.vue
│   │   │   └── VideoPlayer.vue
│   │   ├── user/                # 用户相关组件
│   │   │   ├── UserProfile.vue
│   │   │   ├── UserMenu.vue
│   │   │   └── UserAvatar.vue
│   │   └── forms/               # 表单组件
│   │       ├── LoginForm.vue
│   │       ├── RegisterForm.vue
│   │       └── CourseForm.vue
│   ├── composables/             # Vue 3 组合式函数
│   │   ├── useAuth.js           # 认证逻辑
│   │   ├── useCourse.js         # 课程逻辑
│   │   ├── useApi.js            # API 调用
│   │   └── useProgress.js       # 进度跟踪
│   ├── services/                # 业务服务
│   │   ├── api.js               # API 基础配置
│   │   ├── auth.js              # 认证服务
│   │   ├── course.js            # 课程服务
│   │   └── user.js              # 用户服务
│   ├── utils/                   # 工具函数
│   │   ├── constants.js         # 常量定义
│   │   ├── validators.js        # 表单验证
│   │   ├── formatters.js        # 数据格式化
│   │   └── storage.js           # 本地存储
│   ├── assets/                  # 静态资源
│   │   ├── styles/              # 样式文件
│   │   │   ├── main.css         # 主样式文件
│   │   │   ├── variables.css    # CSS 变量
│   │   │   ├── components.css   # 组件样式
│   │   │   └── utilities.css    # 工具类样式
│   │   ├── icons/               # 图标文件
│   │   └── images/              # 图片资源
│   └── plugins/                 # Vue 插件
│       ├── element-plus.js      # Element Plus 配置
│       └── axios.js             # Axios 配置
├── tests/                       # 测试文件
│   ├── unit/                    # 单元测试
│   ├── integration/             # 集成测试
│   └── e2e/                     # 端到端测试
└── dist/                        # 构建输出目录
```

## 后端项目结构 (Spring Boot)

```
backend/
├── pom.xml                      # Maven 依赖配置
├── .env.example                 # 环境变量示例
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── contoso/
│   │   │           └── elearning/
│   │   │               ├── ELearningApplication.java    # 应用启动类
│   │   │               ├── config/                     # 配置类
│   │   │               │   ├── DatabaseConfig.java
│   │   │               │   ├── SecurityConfig.java
│   │   │               │   ├── WebConfig.java
│   │   │               │   └── SwaggerConfig.java
│   │   │               ├── controller/                 # 控制器层
│   │   │               │   ├── AuthController.java
│   │   │               │   ├── UserController.java
│   │   │               │   ├── CourseController.java
│   │   │               │   ├── EnrollmentController.java
│   │   │               │   └── AdminController.java
│   │   │               ├── service/                    # 业务逻辑层
│   │   │               │   ├── AuthService.java
│   │   │               │   ├── UserService.java
│   │   │               │   ├── CourseService.java
│   │   │               │   ├── EnrollmentService.java
│   │   │               │   └── ProgressService.java
│   │   │               ├── repository/                 # 数据访问层
│   │   │               │   ├── UserRepository.java
│   │   │               │   ├── CourseRepository.java
│   │   │               │   ├── EnrollmentRepository.java
│   │   │               │   └── ProgressRepository.java
│   │   │               ├── entity/                     # 实体类
│   │   │               │   ├── User.java
│   │   │               │   ├── Role.java
│   │   │               │   ├── Course.java
│   │   │               │   ├── Category.java
│   │   │               │   ├── Lesson.java
│   │   │               │   ├── Enrollment.java
│   │   │               │   └── UserLessonProgress.java
│   │   │               ├── dto/                        # 数据传输对象
│   │   │               │   ├── request/
│   │   │               │   │   ├── LoginRequest.java
│   │   │               │   │   ├── RegisterRequest.java
│   │   │               │   │   ├── CourseRequest.java
│   │   │               │   │   └── ProgressRequest.java
│   │   │               │   └── response/
│   │   │               │       ├── UserResponse.java
│   │   │               │       ├── CourseResponse.java
│   │   │               │       ├── EnrollmentResponse.java
│   │   │               │       └── ApiResponse.java
│   │   │               ├── security/                   # 安全相关
│   │   │               │   ├── JwtAuthenticationFilter.java
│   │   │               │   ├── JwtTokenProvider.java
│   │   │               │   └── CustomUserDetails.java
│   │   │               ├── exception/                  # 异常处理
│   │   │               │   ├── GlobalExceptionHandler.java
│   │   │               │   ├── BusinessException.java
│   │   │               │   └── ResourceNotFoundException.java
│   │   │               ├── util/                       # 工具类
│   │   │               │   ├── DateUtils.java
│   │   │               │   ├── ValidationUtils.java
│   │   │               │   └── FileUtils.java
│   │   │               └── enums/                      # 枚举类
│   │   │                   ├── UserRole.java
│   │   │                   ├── CourseStatus.java
│   │   │                   ├── DifficultyLevel.java
│   │   │                   └── LessonType.java
│   │   └── resources/
│   │       ├── application.yml                         # 主配置文件
│   │       ├── application-dev.yml                     # 开发环境配置
│   │       ├── application-prod.yml                    # 生产环境配置
│   │       ├── static/                                 # 静态资源
│   │       ├── templates/                              # 模板文件
│   │       └── db/
│   │           └── migration/                          # Flyway 迁移脚本
│   │               ├── V1__Initial_schema.sql
│   │               ├── V2__Add_user_roles.sql
│   │               └── V3__Add_course_data.sql
│   └── test/
│       └── java/
│           └── com/
│               └── contoso/
│                   └── elearning/
│                       ├── controller/                 # 控制器测试
│                       ├── service/                    # 服务测试
│                       ├── repository/                 # 数据访问测试
│                       └── integration/                # 集成测试
└── target/                                             # Maven 构建输出
```

## 数据库目录结构

```
database/
├── schema.sql                    # 完整数据库架构
├── migrations/                   # Flyway 迁移脚本
│   ├── V1__Initial_schema.sql
│   ├── V2__Add_indexes.sql
│   ├── V3__Add_user_roles.sql
│   └── V4__Add_course_data.sql
├── seeds/                        # 初始化数据
│   ├── roles.sql                 # 角色数据
│   ├── categories.sql            # 分类数据
│   ├── admin_user.sql            # 管理员账户
│   └── sample_courses.sql        # 示例课程
└── procedures/                   # 存储过程和函数
    ├── update_course_progress.sql
    └── calculate_completion_rate.sql
```

## 部署配置目录

```
deployment/
├── docker/
│   ├── Dockerfile.frontend       # 前端 Docker 配置
│   ├── Dockerfile.backend        # 后端 Docker 配置
│   └── Dockerfile.nginx          # Nginx Docker 配置
├── kubernetes/
│   ├── namespace.yaml            # K8s 命名空间
│   ├── configmap.yaml            # 配置映射
│   ├── secret.yaml               # 密钥配置
│   ├── frontend-deployment.yaml  # 前端部署配置
│   ├── backend-deployment.yaml   # 后端部署配置
│   ├── database-deployment.yaml  # 数据库部署配置
│   ├── service.yaml              # 服务配置
│   └── ingress.yaml              # 入口配置
└── nginx/
    ├── nginx.conf                # Nginx 主配置
    ├── default.conf              # 默认站点配置
    └── ssl/                      # SSL 证书文件
```

## 脚本目录

```
scripts/
├── build.sh                     # 构建脚本
├── deploy.sh                    # 部署脚本
├── dev-setup.sh                 # 开发环境搭建
├── backup.sh                    # 数据库备份脚本
├── restore.sh                   # 数据库恢复脚本
└── monitoring/
    ├── health-check.sh           # 健康检查脚本
    └── log-rotation.sh           # 日志轮转脚本
```

## 配置文件说明

### 根目录配置文件

#### docker-compose.yml
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
  
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - database
    environment:
      - SPRING_PROFILES_ACTIVE=development
  
  database:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: rootpassword
      MYSQL_DATABASE: elearning
    ports:
      - "3306:3306"
    volumes:
      - ./database:/docker-entrypoint-initdb.d
```

#### .gitignore
```
# 依赖目录
node_modules/
target/

# 构建输出
dist/
build/

# 环境变量文件
.env
.env.local
.env.*.local

# IDE 文件
.vscode/
.idea/
*.iml

# 系统文件
.DS_Store
Thumbs.db

# 日志文件
*.log
logs/

# 临时文件
temp/
tmp/
```

### 前端配置文件

#### package.json
```json
{
  "name": "contoso-elearning-frontend",
  "version": "1.0.0",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:e2e": "cypress run",
    "lint": "eslint src --ext .vue,.js,.ts",
    "lint:fix": "eslint src --ext .vue,.js,.ts --fix"
  },
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "axios": "^1.4.0",
    "element-plus": "^2.3.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.0",
    "vite": "^4.3.0",
    "vitest": "^0.31.0",
    "cypress": "^12.0.0",
    "eslint": "^8.40.0",
    "@vue/eslint-config-standard": "^8.0.0"
  }
}
```

### 后端配置文件

#### pom.xml
```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0">
    <modelVersion>4.0.0</modelVersion>
    
    <groupId>com.contoso</groupId>
    <artifactId>elearning-backend</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.0</version>
        <relativePath/>
    </parent>
    
    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>mysql</groupId>
            <artifactId>mysql-connector-java</artifactId>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>0.11.5</version>
        </dependency>
    </dependencies>
</project>
```

## 开发环境搭建

### 前置要求
- Node.js 18+
- Java 17+
- MySQL 8.0+
- Git

### 快速启动
```bash
# 1. 克隆项目
git clone https://github.com/nickhou1983/e-learning.git
cd e-learning

# 2. 运行开发环境搭建脚本
./scripts/dev-setup.sh

# 3. 启动服务
docker-compose up -d
```

### 手动启动
```bash
# 启动数据库
docker run -d --name mysql-elearning \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=elearning \
  -p 3306:3306 mysql:8.0

# 启动后端
cd backend
./mvnw spring-boot:run

# 启动前端
cd frontend
npm install
npm run dev
```

## 构建和部署

### 本地构建
```bash
# 构建前端
cd frontend
npm run build

# 构建后端
cd backend
./mvnw clean package

# Docker 构建
docker-compose build
```

### 生产部署
```bash
# 使用 Kubernetes
kubectl apply -f deployment/kubernetes/

# 使用 Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```