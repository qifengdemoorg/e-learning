# 技术规格说明 - E-Learning Platform

## 概述

本文档详细说明了 Contoso.tech 企业在线培训平台的技术实现规格，包含前端、后端、数据库等各个组件的技术选型和实现细节。

## Phase 1 (MVP) 功能清单

### ✅ 已设计功能

#### 1. 基础用户管理
- [x] 用户注册与登录系统设计
- [x] 基于 JWT 的身份认证
- [x] 角色权限管理 (RBAC)
- [x] 个人资料管理界面
- [x] 密码重置流程

#### 2. 基础课程管理
- [x] 课程 CRUD 操作设计
- [x] 课程分类层级结构
- [x] 课程内容管理 (文本、视频、文档)
- [x] 课程发布状态管理
- [x] 讲师课程管理界面

#### 3. 核心学习功能
- [x] 课程目录浏览界面
- [x] 课程详情展示页面
- [x] 学习进度跟踪系统
- [x] 课程完成标记功能
- [x] 学习历史记录

#### 4. 基本 UI 实现
- [x] 响应式主页面设计
- [x] 课程目录页面布局
- [x] 课程学习页面设计
- [x] 个人中心界面设计
- [x] 管理员后台界面

## 技术架构详细说明

### 前端架构 (Vue.js 3.x)

#### 核心依赖
```json
{
  "dependencies": {
    "vue": "^3.3.0",
    "vue-router": "^4.2.0",
    "pinia": "^2.1.0",
    "axios": "^1.4.0",
    "element-plus": "^2.3.0",
    "@element-plus/icons-vue": "^2.1.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^4.2.0",
    "vite": "^4.3.0",
    "typescript": "^5.0.0",
    "eslint": "^8.40.0",
    "@vue/eslint-config-typescript": "^11.0.0",
    "sass": "^1.62.0"
  }
}
```

#### 组件架构
```
src/
├── components/           # 可复用组件
│   ├── common/          # 通用组件
│   │   ├── AppHeader.vue
│   │   ├── AppSidebar.vue
│   │   ├── AppFooter.vue
│   │   └── LoadingSpinner.vue
│   ├── course/          # 课程相关组件
│   │   ├── CourseCard.vue
│   │   ├── CourseFilters.vue
│   │   └── CourseCurriculum.vue
│   └── user/            # 用户相关组件
│       ├── UserProfile.vue
│       └── UserAvatar.vue
├── views/               # 页面组件
│   ├── auth/           # 认证页面
│   ├── dashboard/      # 主页
│   ├── courses/        # 课程页面
│   └── profile/        # 个人中心
├── router/             # 路由配置
├── stores/             # 状态管理
├── services/           # API 服务
└── utils/              # 工具函数
```

#### 状态管理设计
```javascript
// stores/user.js
export const useUserStore = defineStore('user', {
  state: () => ({
    currentUser: null,
    token: null,
    isAuthenticated: false,
    roles: []
  }),
  
  getters: {
    isAdmin: (state) => state.roles.includes('ADMIN'),
    isInstructor: (state) => state.roles.includes('INSTRUCTOR'),
    fullName: (state) => state.currentUser ? 
      `${state.currentUser.firstName} ${state.currentUser.lastName}` : ''
  },
  
  actions: {
    async login(credentials) { /* 登录逻辑 */ },
    async logout() { /* 登出逻辑 */ },
    async fetchProfile() { /* 获取用户信息 */ }
  }
})
```

### 后端架构 (Python FastAPI)

#### 依赖配置
```txt
# requirements.txt
fastapi==0.104.1
uvicorn[standard]==0.24.0
sqlalchemy==2.0.23
alembic==1.12.1
pydantic==2.5.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-multipart==0.0.6
asyncpg==0.29.0  # for PostgreSQL
aiomysql==0.2.0  # for MySQL
pytest==7.4.3
pytest-asyncio==0.21.1
black==23.11.0
isort==5.12.0
mypy==1.7.1
```

#### Poetry 配置 (可选)
```toml
[tool.poetry]
name = "elearning-backend"
version = "0.1.0"
description = "E-Learning Platform Backend API"
authors = ["Your Name <your.email@example.com>"]

[tool.poetry.dependencies]
python = "^3.11"
fastapi = "^0.104.1"
uvicorn = {extras = ["standard"], version = "^0.24.0"}
sqlalchemy = "^2.0.23"
alembic = "^1.12.1"
pydantic = "^2.5.0"
python-jose = {extras = ["cryptography"], version = "^3.3.0"}
passlib = {extras = ["bcrypt"], version = "^1.7.4"}
python-multipart = "^0.0.6"
asyncpg = "^0.29.0"

[tool.poetry.group.dev.dependencies]
pytest = "^7.4.3"
pytest-asyncio = "^0.21.1"
black = "^23.11.0"
isort = "^5.12.0"
mypy = "^1.7.1"
```

#### SQLAlchemy 模型设计
```python
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text, ForeignKey, Table
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

# 用户角色关联表
user_roles = Table(
    'user_roles',
    Base.metadata,
    Column('user_id', Integer, ForeignKey('users.id')),
    Column('role_id', Integer, ForeignKey('roles.id'))
)

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    roles = relationship("Role", secondary=user_roles, back_populates="users")
    courses = relationship("Course", back_populates="instructor")
    enrollments = relationship("Enrollment", back_populates="user")

class Role(Base):
    __tablename__ = "roles"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255))
    
    # 关系
    users = relationship("User", secondary=user_roles, back_populates="roles")

class Course(Base):
    __tablename__ = "courses"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    instructor_id = Column(Integer, ForeignKey("users.id"))
    category_id = Column(Integer, ForeignKey("categories.id"))
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关系
    instructor = relationship("User", back_populates="courses")
    category = relationship("Category", back_populates="courses")
    enrollments = relationship("Enrollment", back_populates="course")
```

#### FastAPI 安全配置
```python
from datetime import datetime, timedelta
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from app.core.config import settings
from app.models.user import User
from app.core.database import get_db

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

def require_roles(*required_roles):
    def role_checker(current_user: User = Depends(get_current_user)):
        user_roles = [role.name for role in current_user.roles]
        if not any(role in user_roles for role in required_roles):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions"
            )
        return current_user
    return role_checker
```

### 数据库设计详情

#### 性能优化索引
```sql
-- 用户表关键索引
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active);

-- 课程表关键索引
CREATE INDEX idx_courses_category ON courses(category_id);
CREATE INDEX idx_courses_instructor ON courses(instructor_id);
CREATE INDEX idx_courses_published ON courses(is_published);
CREATE INDEX idx_courses_created ON courses(created_at);

-- 学习进度复合索引
CREATE INDEX idx_progress_user_course ON enrollments(user_id, course_id);
CREATE INDEX idx_progress_status ON enrollments(status, enrolled_at);

-- 章节进度索引
CREATE INDEX idx_lesson_progress_user ON user_lesson_progress(user_id, lesson_id);
CREATE INDEX idx_lesson_progress_status ON user_lesson_progress(status, last_accessed_at);
```

#### 数据库分区策略 (Phase 2)
```sql
-- 按月分区学习记录表
ALTER TABLE user_lesson_progress 
PARTITION BY RANGE (YEAR(created_at) * 100 + MONTH(created_at)) (
    PARTITION p202401 VALUES LESS THAN (202402),
    PARTITION p202402 VALUES LESS THAN (202403),
    -- 继续按月分区...
);
```

## API 设计规范

### RESTful API 约定
- 使用名词复数形式作为资源路径
- HTTP 方法语义化使用
- 统一的响应格式
- 适当的 HTTP 状态码

### FastAPI 路由控制器
```python
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, require_roles
from app.schemas.course import CourseCreate, CourseResponse, CourseUpdate
from app.schemas.common import PagedResponse
from app.crud.course import course_crud
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=PagedResponse[CourseResponse])
async def get_courses(
    page: int = Query(0, ge=0),
    size: int = Query(20, ge=1, le=100),
    search: Optional[str] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """获取课程列表"""
    courses = await course_crud.get_multi_with_filters(
        db=db, 
        skip=page * size, 
        limit=size,
        search=search,
        category_id=category_id
    )
    total = await course_crud.count_with_filters(db=db, search=search, category_id=category_id)
    
    return PagedResponse(
        items=courses,
        total=total,
        page=page,
        size=size
    )

@router.post("/", response_model=CourseResponse)
async def create_course(
    course: CourseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles("instructor", "admin"))
):
    """创建新课程"""
    return await course_crud.create_with_owner(db=db, obj_in=course, owner_id=current_user.id)

@router.get("/{course_id}", response_model=CourseResponse)
async def get_course(
    course_id: int,
    db: Session = Depends(get_db)
):
    """获取课程详情"""
    course = await course_crud.get(db=db, id=course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    return course
```

### Pydantic 数据模型
```python
from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, EmailStr, validator
from enum import Enum

class DifficultyLevel(str, Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"

# 基础模型
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None
    
class UserCreate(UserBase):
    password: str
    
    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters long')
        return v

class UserResponse(UserBase):
    id: int
    is_active: bool
    created_at: datetime
    roles: List[str] = []
    
    class Config:
        from_attributes = True

# 课程相关模型
class CourseBase(BaseModel):
    title: str
    description: Optional[str] = None
    category_id: int
    difficulty: DifficultyLevel = DifficultyLevel.BEGINNER
    duration_minutes: Optional[int] = None
    cover_image: Optional[str] = None

class CourseCreate(CourseBase):
    pass

class CourseUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    difficulty: Optional[DifficultyLevel] = None
    is_published: Optional[bool] = None

class CourseResponse(CourseBase):
    id: int
    instructor_id: int
    is_published: bool
    enrollment_count: int = 0
    created_at: datetime
    updated_at: datetime
    
    # 关联数据
    instructor: Optional[UserResponse] = None
    category: Optional[dict] = None
    
    class Config:
        from_attributes = True

# 通用分页响应
from typing import TypeVar, Generic
T = TypeVar('T')

class PagedResponse(BaseModel, Generic[T]):
    items: List[T]
    total: int
    page: int
    size: int
    pages: int
    
    def __init__(self, **data):
        super().__init__(**data)
        self.pages = (self.total + self.size - 1) // self.size
```

## 安全实现

### Python JWT 令牌管理
```python
from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from app.core.config import settings

class TokenManager:
    @staticmethod
    def create_access_token(
        subject: str, 
        expires_delta: Optional[timedelta] = None,
        additional_claims: Optional[Dict[str, Any]] = None
    ) -> str:
        """创建访问令牌"""
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(
                minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
            )
        
        to_encode = {"exp": expire, "sub": str(subject)}
        if additional_claims:
            to_encode.update(additional_claims)
            
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.SECRET_KEY, 
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    
    @staticmethod
    def create_refresh_token(subject: str) -> str:
        """创建刷新令牌"""
        expire = datetime.utcnow() + timedelta(
            days=settings.REFRESH_TOKEN_EXPIRE_DAYS
        )
        to_encode = {"exp": expire, "sub": str(subject), "type": "refresh"}
        encoded_jwt = jwt.encode(
            to_encode, 
            settings.SECRET_KEY, 
            algorithm=settings.ALGORITHM
        )
        return encoded_jwt
    
    @staticmethod
    def verify_token(token: str) -> Optional[Dict[str, Any]]:
        """验证令牌"""
        try:
            payload = jwt.decode(
                token, 
                settings.SECRET_KEY, 
                algorithms=[settings.ALGORITHM]
            )
            return payload
        except JWTError:
            return None
    
    @staticmethod
    def decode_token(token: str) -> Optional[str]:
        """解码令牌获取用户ID"""
        payload = TokenManager.verify_token(token)
        if payload:
            return payload.get("sub")
        return None
```

### FastAPI 权限控制
```python
from functools import wraps
from typing import List, Callable
from fastapi import Depends, HTTPException, status
from app.core.security import get_current_user
from app.models.user import User
from app.crud.course import course_crud

def require_roles(*required_roles: str):
    """角色权限装饰器"""
    def decorator(func: Callable):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            current_user = kwargs.get('current_user')
            if not current_user:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Authentication required"
                )
            
            user_roles = [role.name for role in current_user.roles]
            if not any(role in user_roles for role in required_roles):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="Insufficient permissions"
                )
            return await func(*args, **kwargs)
        return wrapper
    return decorator

def require_course_ownership_or_admin(
    course_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """检查课程所有权或管理员权限"""
    user_roles = [role.name for role in current_user.roles]
    
    # 管理员可以访问所有课程
    if "admin" in user_roles:
        return current_user
    
    # 检查是否为课程讲师
    course = course_crud.get(db=db, id=course_id)
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Course not found"
        )
    
    if course.instructor_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access this course"
        )
    
    return current_user

# 使用示例
@router.put("/{course_id}", response_model=CourseResponse)
async def update_course(
    course_id: int,
    course_update: CourseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_course_ownership_or_admin)
):
    """更新课程信息"""
    return await course_crud.update(db=db, db_obj_id=course_id, obj_in=course_update)
```
    // 更新课程逻辑
}
```

## 部署架构

### Python Docker 配置
```dockerfile
# 多阶段构建 - 后端
FROM python:3.11-slim as builder

# 设置环境变量
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# 安装系统依赖
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY requirements.txt .

# 安装 Python 依赖
RUN pip install --no-cache-dir -r requirements.txt

# 生产镜像
FROM python:3.11-slim

# 设置环境变量
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PATH="/app/.venv/bin:$PATH"

# 安装运行时依赖
RUN apt-get update && apt-get install -y \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# 创建非 root 用户
RUN addgroup --gid 1001 --system appgroup && \
    adduser --uid 1001 --system --group appuser

# 设置工作目录
WORKDIR /app

# 从构建阶段复制依赖
COPY --from=builder /usr/local/lib/python3.11/site-packages/ /usr/local/lib/python3.11/site-packages/

# 复制应用代码
COPY --chown=appuser:appgroup . .

# 切换到非 root 用户
USER appuser

# 暴露端口
EXPOSE 8000

# 健康检查
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# 启动命令
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "4"]
```

### Docker Compose 配置
```yaml
version: '3.8'

services:
  backend:
    build: 
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://elearning:password@db:5432/elearning_db
      - SECRET_KEY=${SECRET_KEY}
      - ALLOWED_HOSTS=["http://localhost:3000"]
    depends_on:
      - db
    volumes:
      - ./backend:/app
      - /app/.venv
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:8000
    command: npm run dev

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=elearning_db
      - POSTGRES_USER=elearning
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres_data:
```

### Kubernetes 部署
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: elearning-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: elearning-backend
  template:
    metadata:
      labels:
        app: elearning-backend
    spec:
      containers:
      - name: backend
        image: contoso/elearning-backend:latest
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-secret
              key: database-url
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: app-secret
              key: secret-key
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 20
          periodSeconds: 10
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 30
---
apiVersion: v1
kind: Service
metadata:
  name: elearning-backend-service
spec:
  selector:
    app: elearning-backend
  ports:
    - protocol: TCP
      port: 80
      targetPort: 8000
  type: ClusterIP
```

## 监控和日志

### FastAPI 应用监控
```python
# app/core/config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    # ... 其他配置
    ENABLE_METRICS: bool = True
    LOG_LEVEL: str = "INFO"
    
# app/main.py
from fastapi import FastAPI
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()

# Prometheus 监控
if settings.ENABLE_METRICS:
    Instrumentator().instrument(app).expose(app)

# 健康检查端点
@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow()}

@app.get("/metrics")
async def metrics():
    # Prometheus metrics endpoint
    pass
```

### Python 日志配置
```python
# app/core/logging.py
import logging
import sys
from typing import Any, Dict
from loguru import logger
from app.core.config import settings

class InterceptHandler(logging.Handler):
    def emit(self, record):
        # Get corresponding Loguru level if it exists
        try:
            level = logger.level(record.levelname).name
        except ValueError:
            level = record.levelno

        # Find caller from where originated the logged message
        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(
            level, record.getMessage()
        )

def setup_logging():
    # intercept everything at the root logger
    logging.root.handlers = [InterceptHandler()]
    logging.root.setLevel(settings.LOG_LEVEL)

    # remove every other logger's handlers
    # and propagate to root logger
    for name in logging.root.manager.loggerDict.keys():
        logging.getLogger(name).handlers = []
        logging.getLogger(name).propagate = True

    # configure loguru
    logger.configure(
        handlers=[
            {
                "sink": sys.stdout,
                "serialize": settings.JSON_LOGS,
                "format": "<green>{time:YYYY-MM-DD HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level>",
            }
        ]
    )
```

### 结构化日志示例
```python
# app/utils/logger.py
from loguru import logger
import json
from typing import Any, Dict

def log_api_call(endpoint: str, method: str, user_id: int = None, **kwargs):
    """记录 API 调用日志"""
    log_data = {
        "event": "api_call",
        "endpoint": endpoint,
        "method": method,
        "user_id": user_id,
        **kwargs
    }
    logger.info(json.dumps(log_data))

def log_error(error: Exception, context: Dict[str, Any] = None):
    """记录错误日志"""
    log_data = {
        "event": "error",
        "error_type": type(error).__name__,
        "error_message": str(error),
        "context": context or {}
    }
    logger.error(json.dumps(log_data))

# 使用示例
@router.post("/courses/")
async def create_course(course: CourseCreate, current_user: User = Depends(get_current_user)):
    try:
        log_api_call("create_course", "POST", user_id=current_user.id)
        result = await course_crud.create(course)
        return result
    except Exception as e:
        log_error(e, {"user_id": current_user.id, "course_data": course.dict()})
        raise
```
                    <message/>
                    <mdc/>
                    <stackTrace/>
                </providers>
            </encoder>
        </appender>
        <root level="INFO">
            <appender-ref ref="FILE" />
        </root>
    </springProfile>
</configuration>
```

## 性能优化

### 数据库优化
- SQLAlchemy 查询优化和懒加载
- 异步数据库操作 (asyncpg/aiomysql)
- 连接池配置优化
- 数据库索引优化
- 查询分析和慢查询监控
- 读写分离 (Phase 2)

### Python 缓存策略
```python
from functools import lru_cache
from typing import Optional
import redis
import json
from app.core.config import settings

# Redis 缓存
redis_client = redis.Redis.from_url(settings.REDIS_URL)

def cache_key(prefix: str, **kwargs) -> str:
    """生成缓存键"""
    key_parts = [prefix] + [f"{k}:{v}" for k, v in sorted(kwargs.items())]
    return ":".join(key_parts)

async def get_cached_course(course_id: int) -> Optional[dict]:
    """获取缓存的课程信息"""
    key = cache_key("course", id=course_id)
    cached = redis_client.get(key)
    if cached:
        return json.loads(cached)
    return None

async def cache_course(course_id: int, course_data: dict, expire: int = 3600):
    """缓存课程信息"""
    key = cache_key("course", id=course_id)
    redis_client.setex(key, expire, json.dumps(course_data))

# 使用装饰器缓存
@lru_cache(maxsize=1000)
def get_category_tree():
    """获取分类树结构 - 内存缓存"""
    # 分类树查询逻辑
    pass

# FastAPI 中使用缓存
@router.get("/{course_id}")
async def get_course(course_id: int):
    # 先检查缓存
    cached = await get_cached_course(course_id)
    if cached:
        return cached
    
    # 从数据库查询
    course = await course_crud.get(id=course_id)
    if course:
        await cache_course(course_id, course.dict())
    return course
```

### 前端优化
- Vue 3 组件懒加载和异步组件
- Vite 代码分割和 Tree Shaking
- 图片懒加载和 WebP 格式
- Service Worker 缓存策略
- 前端资源 CDN 部署

## 测试策略

### Python 后端测试
```python
# tests/conftest.py
import pytest
import asyncio
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.core.database import get_db, Base
from app.core.config import settings

# 测试数据库配置
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture
def client():
    Base.metadata.create_all(bind=engine)
    with TestClient(app) as c:
        yield c
    Base.metadata.drop_all(bind=engine)

# tests/test_courses.py
import pytest
from app.schemas.course import CourseCreate

def test_create_course(client, auth_headers):
    course_data = {
        "title": "Test Course",
        "description": "Test Description",
        "category_id": 1
    }
    response = client.post(
        "/api/courses/",
        json=course_data,
        headers=auth_headers
    )
    assert response.status_code == 200
    data = response.json()
    assert data["title"] == "Test Course"
    assert data["description"] == "Test Description"

@pytest.mark.asyncio
async def test_course_service():
    # 异步测试示例
    course_data = CourseCreate(title="Async Test", category_id=1)
    result = await course_crud.create(course_data)
    assert result.title == "Async Test"

# 集成测试with 数据库
@pytest.mark.integration
def test_course_integration(client):
    # 测试完整的课程创建流程
    pass
```

### 前端测试
```javascript
// tests/unit/CourseCard.spec.js
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import CourseCard from '@/components/course/CourseCard.vue'

describe('CourseCard', () => {
  it('renders course information correctly', () => {
    const course = {
      id: 1,
      title: 'Test Course',
      description: 'Test Description',
      instructor: { name: 'John Doe' }
    }
    
    const wrapper = mount(CourseCard, {
      props: { course },
      global: {
        plugins: [createTestingPinia()]
      }
    })
    
    expect(wrapper.text()).toContain('Test Course')
    expect(wrapper.text()).toContain('Test Description')
    expect(wrapper.text()).toContain('John Doe')
  })
  
  it('emits enroll event when button clicked', async () => {
    const course = { id: 1, title: 'Test Course' }
    const wrapper = mount(CourseCard, {
      props: { course },
      global: {
        plugins: [createTestingPinia()]
      }
    })
    
    await wrapper.find('[data-testid="enroll-button"]').trigger('click')
    expect(wrapper.emitted().enroll).toBeTruthy()
    expect(wrapper.emitted().enroll[0]).toEqual([course.id])
  })
})

// E2E 测试 (Playwright)
// tests/e2e/course.spec.js
import { test, expect } from '@playwright/test'

test('user can browse and enroll in courses', async ({ page }) => {
  await page.goto('/courses')
  
  // 检查课程列表
  await expect(page.locator('[data-testid="course-card"]')).toHaveCount(3)
  
  // 点击第一个课程
  await page.locator('[data-testid="course-card"]').first().click()
  
  // 检查课程详情页
  await expect(page.locator('h1')).toContainText('Course Title')
  
  // 点击注册按钮
  await page.locator('[data-testid="enroll-button"]').click()
  
  // 验证注册成功
  await expect(page.locator('.success-message')).toBeVisible()
})
```

## 扩展规划

### Phase 2 功能与技术实现
- **实时视频会议**: WebRTC + Socket.IO/WebSocket 集成
- **高级搜索**: Elasticsearch 全文搜索 + 过滤器
- **课程评价系统**: 评分算法和评论管理
- **学习路径推荐**: 基于协同过滤的推荐算法
- **移动端 PWA**: Vue 3 PWA + Workbox
- **文件上传**: MinIO 对象存储 + 多媒体处理

### Phase 3 高级功能
- **AI 智能推荐**: TensorFlow/PyTorch + FastAPI ML 服务
- **多语言支持**: i18n 国际化 + 动态语言包
- **社交学习**: 实时聊天 + 学习小组功能
- **高级数据分析**: Apache Superset + 自定义仪表板
- **第三方集成**: SAML/OAuth2 SSO + API Gateway
- **微服务架构**: 服务拆分 + Docker Swarm/Kubernetes

### 技术债务管理
- 代码质量监控 (SonarQube)
- 自动化测试覆盖率提升
- 性能监控和告警系统
- 安全漏洞扫描和修复
- 依赖包定期更新策略

---

## 总结

本技术规格文档详细描述了基于 **Python FastAPI** 后端和 **Vue.js 3** 前端的企业在线培训平台技术实现方案。Python 生态系统的优势包括：

- **开发效率高**: FastAPI 自动 API 文档生成，Pydantic 数据验证
- **性能优秀**: 异步编程支持，与 Node.js 性能相当
- **生态丰富**: 丰富的第三方库和 AI/ML 集成能力
- **部署灵活**: Docker 容器化，Kubernetes 原生支持
- **维护简单**: Python 代码可读性强，团队学习成本低

该架构设计支持快速迭代开发，具备良好的扩展性和维护性，能够满足企业级应用的性能和安全要求。