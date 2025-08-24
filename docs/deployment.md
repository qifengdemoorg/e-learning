# 部署指南 - E-Learning Platform

## 概述

本文档描述了 Contoso.tech 企业在线培训平台的生产环境部署方案，包含 Docker、Kubernetes 和传统服务器部署方式。

## 部署架构

### 生产环境架构
```
                    ┌─────────────────┐
                    │   Load Balancer │
                    │    (Nginx)      │
                    └─────────────────┘
                             │
                    ┌─────────────────┐
                    │   API Gateway   │
                    │   (Optional)    │
                    └─────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Frontend    │    │   Backend    │    │   Backend    │
│  (Nginx)     │    │ (Spring Boot)│    │ (Spring Boot)│
│  Port: 80    │    │  Port: 8080  │    │  Port: 8081  │
└──────────────┘    └──────────────┘    └──────────────┘
                             │
                    ┌─────────────────┐
                    │   Database      │
                    │   (MySQL)       │
                    │   Port: 3306    │
                    └─────────────────┘
```

## Docker 部署

### 1. 构建 Docker 镜像

#### 前端 Dockerfile
```dockerfile
# frontend/Dockerfile
# 构建阶段
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine

# 复制构建文件
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制 Nginx 配置
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

#### 后端 Dockerfile
```dockerfile
# backend/Dockerfile
FROM openjdk:17-jdk-alpine AS builder

WORKDIR /app
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .
RUN ./mvnw dependency:go-offline

COPY src ./src
RUN ./mvnw clean package -DskipTests

# 生产镜像
FROM openjdk:17-jre-alpine

RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

RUN chown appuser:appgroup app.jar
USER appuser

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
```

### 2. Docker Compose 配置

#### 开发环境
```yaml
# docker-compose.dev.yml
version: '3.8'

services:
  database:
    image: mysql:8.0
    container_name: elearning-db-dev
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: elearning
      MYSQL_USER: elearning_user
      MYSQL_PASSWORD: elearning_pass
    ports:
      - "3306:3306"
    volumes:
      - mysql_data_dev:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/01-schema.sql
      - ./database/seeds:/docker-entrypoint-initdb.d/seeds
    networks:
      - elearning-network

  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    container_name: elearning-backend-dev
    environment:
      SPRING_PROFILES_ACTIVE: development
      DB_HOST: database
      DB_PORT: 3306
      DB_NAME: elearning
      DB_USERNAME: elearning_user
      DB_PASSWORD: elearning_pass
      JWT_SECRET: dev-jwt-secret-key
    ports:
      - "8080:8080"
    depends_on:
      - database
    volumes:
      - ./backend/src:/app/src
    networks:
      - elearning-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    container_name: elearning-frontend-dev
    environment:
      VITE_API_BASE_URL: http://localhost:8080/api/v1
    ports:
      - "3000:3000"
    volumes:
      - ./frontend/src:/app/src
      - ./frontend/public:/app/public
    networks:
      - elearning-network

volumes:
  mysql_data_dev:

networks:
  elearning-network:
    driver: bridge
```

#### 生产环境
```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  nginx:
    image: nginx:alpine
    container_name: elearning-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./deployment/nginx/nginx.conf:/etc/nginx/nginx.conf
      - ./deployment/nginx/ssl:/etc/nginx/ssl
      - static_files:/usr/share/nginx/html/static
    depends_on:
      - frontend
      - backend
    networks:
      - elearning-network

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: elearning-frontend
    environment:
      NODE_ENV: production
    volumes:
      - static_files:/usr/share/nginx/html/static
    networks:
      - elearning-network

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: elearning-backend
    environment:
      SPRING_PROFILES_ACTIVE: production
      DB_HOST: database
      DB_PORT: 3306
      DB_NAME: elearning
      DB_USERNAME: ${DB_USERNAME}
      DB_PASSWORD: ${DB_PASSWORD}
      JWT_SECRET: ${JWT_SECRET}
    depends_on:
      - database
    networks:
      - elearning-network

  database:
    image: mysql:8.0
    container_name: elearning-database
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: elearning
      MYSQL_USER: ${DB_USERNAME}
      MYSQL_PASSWORD: ${DB_PASSWORD}
    volumes:
      - mysql_data_prod:/var/lib/mysql
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql
      - ./deployment/mysql/my.cnf:/etc/mysql/conf.d/my.cnf
    networks:
      - elearning-network

volumes:
  mysql_data_prod:
  static_files:

networks:
  elearning-network:
    driver: bridge
```

### 3. 部署脚本

#### 构建脚本
```bash
#!/bin/bash
# scripts/build.sh

set -e

echo "Building E-Learning Platform..."

# 构建前端
echo "Building frontend..."
cd frontend
npm ci
npm run build
cd ..

# 构建后端
echo "Building backend..."
cd backend
./mvnw clean package -DskipTests
cd ..

# 构建 Docker 镜像
echo "Building Docker images..."
docker-compose -f docker-compose.prod.yml build

echo "Build completed successfully!"
```

#### 部署脚本
```bash
#!/bin/bash
# scripts/deploy.sh

set -e

ENV=${1:-production}
VERSION=${2:-latest}

echo "Deploying E-Learning Platform to $ENV environment..."

# 检查环境变量
if [ ! -f ".env.$ENV" ]; then
    echo "Environment file .env.$ENV not found!"
    exit 1
fi

# 加载环境变量
source .env.$ENV

# 备份数据库 (生产环境)
if [ "$ENV" = "production" ]; then
    echo "Creating database backup..."
    ./scripts/backup.sh
fi

# 拉取最新镜像
echo "Pulling latest images..."
docker-compose -f docker-compose.$ENV.yml pull

# 停止现有服务
echo "Stopping existing services..."
docker-compose -f docker-compose.$ENV.yml down

# 启动新服务
echo "Starting services..."
docker-compose -f docker-compose.$ENV.yml up -d

# 健康检查
echo "Performing health checks..."
sleep 30

# 检查服务状态
if curl -f http://localhost/api/health; then
    echo "Deployment successful!"
else
    echo "Deployment failed - rolling back..."
    docker-compose -f docker-compose.$ENV.yml down
    # 这里可以添加回滚逻辑
    exit 1
fi
```

## Kubernetes 部署

### 1. 命名空间和配置

#### 命名空间
```yaml
# deployment/kubernetes/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: elearning
  labels:
    name: elearning
```

#### ConfigMap
```yaml
# deployment/kubernetes/configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: elearning-config
  namespace: elearning
data:
  database-host: "mysql-service"
  database-port: "3306"
  database-name: "elearning"
  jwt-expiration: "3600"
  app-environment: "production"
```

#### Secret
```yaml
# deployment/kubernetes/secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: elearning-secrets
  namespace: elearning
type: Opaque
data:
  db-username: ZWxlYXJuaW5nX3VzZXI=  # base64 encoded
  db-password: ZWxlYXJuaW5nX3Bhc3M=  # base64 encoded
  jwt-secret: c3VwZXItc2VjcmV0LWp3dC1rZXk=  # base64 encoded
  mysql-root-password: cm9vdHBhc3N3b3Jk  # base64 encoded
```

### 2. 数据库部署

```yaml
# deployment/kubernetes/database-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-deployment
  namespace: elearning
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
      - name: mysql
        image: mysql:8.0
        env:
        - name: MYSQL_ROOT_PASSWORD
          valueFrom:
            secretKeyRef:
              name: elearning-secrets
              key: mysql-root-password
        - name: MYSQL_DATABASE
          valueFrom:
            configMapKeyRef:
              name: elearning-config
              key: database-name
        - name: MYSQL_USER
          valueFrom:
            secretKeyRef:
              name: elearning-secrets
              key: db-username
        - name: MYSQL_PASSWORD
          valueFrom:
            secretKeyRef:
              name: elearning-secrets
              key: db-password
        ports:
        - containerPort: 3306
        volumeMounts:
        - name: mysql-storage
          mountPath: /var/lib/mysql
        - name: mysql-init
          mountPath: /docker-entrypoint-initdb.d
      volumes:
      - name: mysql-storage
        persistentVolumeClaim:
          claimName: mysql-pvc
      - name: mysql-init
        configMap:
          name: mysql-init-scripts

---
apiVersion: v1
kind: Service
metadata:
  name: mysql-service
  namespace: elearning
spec:
  selector:
    app: mysql
  ports:
  - port: 3306
    targetPort: 3306
  clusterIP: None
```

### 3. 后端部署

```yaml
# deployment/kubernetes/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-deployment
  namespace: elearning
spec:
  replicas: 3
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
      - name: backend
        image: contoso/elearning-backend:latest
        env:
        - name: SPRING_PROFILES_ACTIVE
          value: "production"
        - name: DB_HOST
          valueFrom:
            configMapKeyRef:
              name: elearning-config
              key: database-host
        - name: DB_PORT
          valueFrom:
            configMapKeyRef:
              name: elearning-config
              key: database-port
        - name: DB_NAME
          valueFrom:
            configMapKeyRef:
              name: elearning-config
              key: database-name
        - name: DB_USERNAME
          valueFrom:
            secretKeyRef:
              name: elearning-secrets
              key: db-username
        - name: DB_PASSWORD
          valueFrom:
            secretKeyRef:
              name: elearning-secrets
              key: db-password
        - name: JWT_SECRET
          valueFrom:
            secretKeyRef:
              name: elearning-secrets
              key: jwt-secret
        ports:
        - containerPort: 8080
        readinessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 30
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /actuator/health
            port: 8080
          initialDelaySeconds: 60
          periodSeconds: 30

---
apiVersion: v1
kind: Service
metadata:
  name: backend-service
  namespace: elearning
spec:
  selector:
    app: backend
  ports:
  - port: 8080
    targetPort: 8080
  type: ClusterIP
```

### 4. 前端部署

```yaml
# deployment/kubernetes/frontend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend-deployment
  namespace: elearning
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: contoso/elearning-frontend:latest
        ports:
        - containerPort: 80
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 10
          periodSeconds: 5

---
apiVersion: v1
kind: Service
metadata:
  name: frontend-service
  namespace: elearning
spec:
  selector:
    app: frontend
  ports:
  - port: 80
    targetPort: 80
  type: ClusterIP
```

### 5. Ingress 配置

```yaml
# deployment/kubernetes/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: elearning-ingress
  namespace: elearning
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  tls:
  - hosts:
    - elearning.contoso.com
    secretName: elearning-tls
  rules:
  - host: elearning.contoso.com
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: backend-service
            port:
              number: 8080
      - path: /
        pathType: Prefix
        backend:
          service:
            name: frontend-service
            port:
              number: 80
```

## Nginx 配置

### 生产环境配置
```nginx
# deployment/nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
    use epoll;
    multi_accept on;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    # 基本设置
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    # Gzip 压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 10240;
    gzip_proxied expired no-cache no-store private must-revalidate;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/x-javascript
        application/xml+rss
        application/javascript
        application/json;

    # 上游服务器
    upstream backend {
        server backend:8080 max_fails=3 fail_timeout=30s;
        keepalive 32;
    }

    # 主服务器配置
    server {
        listen 80;
        server_name elearning.contoso.com;
        
        # 重定向到 HTTPS
        return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl http2;
        server_name elearning.contoso.com;

        # SSL 配置
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
        ssl_prefer_server_ciphers off;

        # 安全头
        add_header X-Frame-Options DENY;
        add_header X-Content-Type-Options nosniff;
        add_header X-XSS-Protection "1; mode=block";
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

        # 静态文件
        location / {
            root /usr/share/nginx/html;
            index index.html;
            try_files $uri $uri/ /index.html;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # API 代理
        location /api/ {
            proxy_pass http://backend/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }

        # WebSocket 支持
        location /ws/ {
            proxy_pass http://backend/ws/;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
        }

        # 健康检查
        location /health {
            access_log off;
            return 200 "healthy\n";
            add_header Content-Type text/plain;
        }
    }
}
```

## 监控和日志

### 1. 健康检查
```bash
#!/bin/bash
# scripts/health-check.sh

# 检查前端
if curl -f http://localhost/ > /dev/null 2>&1; then
    echo "Frontend: OK"
else
    echo "Frontend: FAILED"
    exit 1
fi

# 检查后端
if curl -f http://localhost/api/health > /dev/null 2>&1; then
    echo "Backend: OK"
else
    echo "Backend: FAILED"
    exit 1
fi

# 检查数据库
if mysql -h localhost -u $DB_USERNAME -p$DB_PASSWORD -e "SELECT 1" > /dev/null 2>&1; then
    echo "Database: OK"
else
    echo "Database: FAILED"
    exit 1
fi

echo "All services are healthy!"
```

### 2. 备份脚本
```bash
#!/bin/bash
# scripts/backup.sh

BACKUP_DIR="/backup"
DATE=$(date +%Y%m%d_%H%M%S)
DB_NAME="elearning"

# 创建备份目录
mkdir -p $BACKUP_DIR

# 数据库备份
mysqldump -h localhost -u $DB_USERNAME -p$DB_PASSWORD $DB_NAME > $BACKUP_DIR/db_backup_$DATE.sql

# 压缩备份文件
gzip $BACKUP_DIR/db_backup_$DATE.sql

# 清理旧备份 (保留30天)
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +30 -delete

echo "Backup completed: db_backup_$DATE.sql.gz"
```

## 环境变量配置

### 生产环境变量
```bash
# .env.production
# 数据库配置
DB_HOST=mysql-service
DB_PORT=3306
DB_NAME=elearning
DB_USERNAME=elearning_user
DB_PASSWORD=SuperSecurePassword123!
MYSQL_ROOT_PASSWORD=RootPassword456!

# JWT 配置
JWT_SECRET=super-secure-jwt-secret-key-with-256-bits
JWT_EXPIRATION=3600

# 应用配置
SPRING_PROFILES_ACTIVE=production
SERVER_PORT=8080

# 前端配置
VITE_API_BASE_URL=https://elearning.contoso.com/api/v1
VITE_APP_TITLE=Contoso E-Learning Platform

# 邮件配置 (可选)
MAIL_HOST=smtp.contoso.com
MAIL_PORT=587
MAIL_USERNAME=noreply@contoso.com
MAIL_PASSWORD=MailPassword789!
```

## CI/CD 配置

### GitHub Actions 示例
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v2
    
    - name: Login to DockerHub
      uses: docker/login-action@v2
      with:
        username: ${{ secrets.DOCKER_USERNAME }}
        password: ${{ secrets.DOCKER_PASSWORD }}
    
    - name: Build and push images
      run: |
        docker build -t contoso/elearning-frontend:latest ./frontend
        docker build -t contoso/elearning-backend:latest ./backend
        docker push contoso/elearning-frontend:latest
        docker push contoso/elearning-backend:latest
    
    - name: Deploy to production
      run: |
        # 这里添加部署到生产环境的步骤
        # 例如: kubectl apply -f deployment/kubernetes/
```

## 故障排除

### 常见问题
1. **容器启动失败**: 检查环境变量和依赖服务
2. **数据库连接失败**: 验证网络连接和认证信息
3. **前端资源加载失败**: 检查 Nginx 配置和静态文件路径
4. **API 请求超时**: 调整代理超时设置

### 日志查看
```bash
# Docker 日志
docker logs elearning-backend
docker logs elearning-frontend
docker logs elearning-database

# Kubernetes 日志
kubectl logs -f deployment/backend-deployment -n elearning
kubectl logs -f deployment/frontend-deployment -n elearning
```