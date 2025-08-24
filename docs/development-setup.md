# 开发环境搭建指南 - E-Learning Platform

## 概述

本文档详细说明了如何搭建 Contoso.tech 企业在线培训平台的开发环境，包含前端、后端、数据库的完整配置。

## 系统要求

### 硬件要求
- **RAM**: 最低 8GB，推荐 16GB
- **存储**: 最低 20GB 可用空间
- **CPU**: 支持 64 位的多核处理器

### 软件要求
- **操作系统**: Windows 10+, macOS 10.15+, Ubuntu 18.04+
- **Node.js**: 18.x 或更高版本
- **Java**: JDK 17 或更高版本
- **MySQL**: 8.0 或更高版本
- **Git**: 2.30 或更高版本
- **Docker**: 20.10+ (可选，推荐)
- **IDE**: VS Code, IntelliJ IDEA 或其他

## 环境安装

### 1. 安装 Node.js

#### Windows
```bash
# 使用 Chocolatey
choco install nodejs

# 或下载安装包
# https://nodejs.org/en/download/
```

#### macOS
```bash
# 使用 Homebrew
brew install node

# 或使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Linux (Ubuntu)
```bash
# 使用包管理器
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 或使用 nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

### 2. 安装 Java JDK

#### Windows
```bash
# 使用 Chocolatey
choco install openjdk17

# 或下载 Oracle JDK
# https://www.oracle.com/java/technologies/downloads/
```

#### macOS
```bash
# 使用 Homebrew
brew install openjdk@17

# 添加到 PATH
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
```

#### Linux (Ubuntu)
```bash
# 安装 OpenJDK 17
sudo apt update
sudo apt install openjdk-17-jdk

# 验证安装
java -version
javac -version
```

### 3. 安装 MySQL

#### 使用 Docker (推荐)
```bash
# 启动 MySQL 容器
docker run -d \
  --name mysql-elearning \
  -e MYSQL_ROOT_PASSWORD=rootpassword \
  -e MYSQL_DATABASE=elearning \
  -e MYSQL_USER=elearning_user \
  -e MYSQL_PASSWORD=elearning_pass \
  -p 3306:3306 \
  mysql:8.0
```

#### 原生安装
**Windows**: 下载 MySQL Installer
**macOS**: `brew install mysql`
**Linux**: `sudo apt install mysql-server`

### 4. 安装开发工具

#### Git
```bash
# Windows (Chocolatey)
choco install git

# macOS (Homebrew)
brew install git

# Linux (Ubuntu)
sudo apt install git
```

#### VS Code (推荐前端开发)
- 下载地址: https://code.visualstudio.com/
- 推荐插件:
  - Vue Language Features (Volar)
  - ESLint
  - Prettier
  - GitLens
  - Auto Rename Tag

#### IntelliJ IDEA (推荐后端开发)
- 下载地址: https://www.jetbrains.com/idea/
- 推荐插件:
  - Spring Boot
  - Maven Helper
  - Lombok
  - Database Navigator

## 项目设置

### 1. 克隆项目
```bash
# 克隆仓库
git clone https://github.com/nickhou1983/e-learning.git
cd e-learning

# 查看项目结构
ls -la
```

### 2. 环境变量配置

#### 前端环境变量
```bash
# 复制环境变量模板
cp frontend/.env.example frontend/.env.development

# 编辑开发环境配置
# frontend/.env.development
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_APP_TITLE=Contoso E-Learning Platform
VITE_APP_DEBUG=true
```

#### 后端环境变量
```bash
# 复制环境变量模板
cp backend/.env.example backend/.env

# 编辑配置
# backend/.env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=elearning
DB_USERNAME=elearning_user
DB_PASSWORD=elearning_pass
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRATION=3600
```

### 3. 数据库初始化

#### 创建数据库
```sql
-- 连接到 MySQL
mysql -u root -p

-- 创建数据库和用户
CREATE DATABASE elearning CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'elearning_user'@'localhost' IDENTIFIED BY 'elearning_pass';
GRANT ALL PRIVILEGES ON elearning.* TO 'elearning_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 运行迁移脚本
```bash
# 运行数据库迁移
cd database
mysql -u elearning_user -p elearning < schema.sql

# 插入初始数据
mysql -u elearning_user -p elearning < seeds/roles.sql
mysql -u elearning_user -p elearning < seeds/categories.sql
mysql -u elearning_user -p elearning < seeds/admin_user.sql
```

## 后端开发环境

### 1. 安装依赖
```bash
cd backend

# 使用 Maven 安装依赖
./mvnw clean install

# 或使用 IDE 的 Maven 集成功能
```

### 2. 配置 application.yml
```yaml
# backend/src/main/resources/application-dev.yml
server:
  port: 8080

spring:
  profiles:
    active: dev
  
  datasource:
    url: jdbc:mysql://localhost:3306/elearning?useSSL=false&serverTimezone=UTC
    username: ${DB_USERNAME:elearning_user}
    password: ${DB_PASSWORD:elearning_pass}
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.MySQL8Dialect
        format_sql: true
  
  flyway:
    enabled: true
    locations: classpath:db/migration

jwt:
  secret: ${JWT_SECRET:your-super-secret-jwt-key-here}
  expiration: ${JWT_EXPIRATION:3600}

logging:
  level:
    com.contoso.elearning: DEBUG
    org.springframework.security: DEBUG
```

### 3. 启动后端服务
```bash
# 方式 1: 使用 Maven
./mvnw spring-boot:run

# 方式 2: 使用 IDE
# 在 IntelliJ IDEA 中运行 ELearningApplication.java

# 方式 3: 使用 JAR 文件
./mvnw clean package
java -jar target/elearning-backend-1.0.0.jar
```

### 4. 验证后端服务
```bash
# 检查健康状态
curl http://localhost:8080/actuator/health

# 查看 API 文档
# 访问: http://localhost:8080/swagger-ui.html
```

## 前端开发环境

### 1. 安装依赖
```bash
cd frontend

# 安装 npm 依赖
npm install

# 或使用 yarn
yarn install
```

### 2. 配置开发环境
```javascript
// frontend/vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
```

### 3. 启动前端服务
```bash
# 启动开发服务器
npm run dev

# 或使用 yarn
yarn dev

# 访问: http://localhost:3000
```

### 4. 构建和测试
```bash
# 运行单元测试
npm run test

# 运行端到端测试
npm run test:e2e

# 代码检查
npm run lint

# 构建生产版本
npm run build
```

## 开发工具配置

### 1. VS Code 配置

#### 工作区设置
```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "eslint.workingDirectories": ["frontend"],
  "java.project.sourcePaths": ["backend/src/main/java"],
  "java.project.referencedLibraries": ["backend/target/dependency/*.jar"]
}
```

#### 推荐插件
```json
// .vscode/extensions.json
{
  "recommendations": [
    "Vue.volar",
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "eamodio.gitlens",
    "redhat.java",
    "vscjava.vscode-spring-boot",
    "ms-vscode.vscode-json"
  ]
}
```

### 2. IntelliJ IDEA 配置

#### 项目设置
1. 打开项目: `File > Open > 选择 backend 目录`
2. 配置 JDK: `File > Project Structure > Project SDK`
3. 导入 Maven 项目: `Maven > Reload`
4. 配置运行配置: `Run > Edit Configurations`

#### 代码风格
```xml
<!-- .idea/codeStyles/Project.xml -->
<component name="ProjectCodeStyleConfiguration">
  <code_scheme name="Project" version="173">
    <JavaCodeStyleSettings>
      <option name="IMPORT_LAYOUT_TABLE">
        <value>
          <package name="" withSubpackages="true" static="false" />
        </value>
      </option>
    </JavaCodeStyleSettings>
  </code_scheme>
</component>
```

## 调试配置

### 1. 前端调试 (VS Code)
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Launch Chrome",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000",
      "webRoot": "${workspaceFolder}/frontend/src"
    }
  ]
}
```

### 2. 后端调试 (IntelliJ IDEA)
```
# 创建 Spring Boot 运行配置
Name: E-Learning Backend
Main class: com.contoso.elearning.ELearningApplication
JVM options: -Dspring.profiles.active=dev
Environment variables: 
  DB_USERNAME=elearning_user
  DB_PASSWORD=elearning_pass
```

## 常见问题和解决方案

### 1. 端口冲突
```bash
# 查看端口占用
netstat -ano | findstr :8080  # Windows
lsof -i :8080                 # macOS/Linux

# 杀死进程
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # macOS/Linux
```

### 2. 数据库连接问题
```bash
# 检查 MySQL 服务状态
systemctl status mysql        # Linux
brew services list mysql      # macOS

# 重启 MySQL 服务
systemctl restart mysql       # Linux
brew services restart mysql   # macOS
```

### 3. 依赖安装问题
```bash
# 清理 npm 缓存
npm cache clean --force

# 删除 node_modules 重新安装
rm -rf node_modules package-lock.json
npm install

# Maven 依赖问题
./mvnw dependency:purge-local-repository
./mvnw clean install
```

### 4. 权限问题
```bash
# 修复 npm 权限问题
sudo chown -R $(whoami) ~/.npm

# 修复文件权限
chmod +x scripts/*.sh
```

## 开发流程

### 1. 日常开发流程
```bash
# 1. 拉取最新代码
git pull origin main

# 2. 启动数据库 (Docker)
docker start mysql-elearning

# 3. 启动后端
cd backend && ./mvnw spring-boot:run

# 4. 启动前端
cd frontend && npm run dev

# 5. 开始开发...
```

### 2. 提交代码流程
```bash
# 1. 运行测试
npm run test        # 前端
./mvnw test        # 后端

# 2. 代码检查
npm run lint       # 前端
./mvnw checkstyle:check  # 后端

# 3. 提交代码
git add .
git commit -m "feat: add user registration feature"
git push origin feature/user-registration
```

### 3. 代码规范
- **提交信息**: 使用 Conventional Commits 规范
  - `feat:` 新功能
  - `fix:` 错误修复
  - `docs:` 文档更新
  - `style:` 代码格式化
  - `refactor:` 重构
  - `test:` 测试相关
  - `chore:` 构建或辅助工具的变动

- **分支命名**: 
  - `feature/功能名称`
  - `bugfix/问题描述`
  - `hotfix/紧急修复`

## 性能优化建议

### 1. 开发环境优化
- 使用 SSD 硬盘提高 I/O 性能
- 增加内存避免频繁垃圾回收
- 使用代码热重载减少重启时间

### 2. 工具配置优化
```bash
# Maven 内存配置
export MAVEN_OPTS="-Xmx2048m -XX:MaxPermSize=256m"

# Node.js 内存配置
export NODE_OPTIONS="--max_old_space_size=4096"
```

### 3. IDE 性能优化
- 关闭不必要的插件
- 调整语法检查设置
- 使用本地历史记录功能