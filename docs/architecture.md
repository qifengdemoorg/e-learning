# Contoso.tech E-Learning Platform - 系统架构设计

## 概述

本文档描述了 Contoso.tech 企业在线培训平台 MVP 版本的系统架构设计。该平台采用前后端分离的架构，为企业提供完整的在线学习解决方案。

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
                              │       FastAPI Application          │
                              │        (Python Backend)            │
                              └─────────────────────────────────────┘
                                              │
                                              ▼
                              ┌─────────────────────────────────────┐
                              │       Database Layer               │
                              │     (MySQL/PostgreSQL)             │
                              └─────────────────────────────────────┘
```

### 技术栈

#### 前端技术栈
- **框架**: Vue.js 3.x
- **构建工具**: Vite
- **UI组件库**: Element Plus / Ant Design Vue
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **样式**: SCSS/CSS3
- **类型检查**: TypeScript (可选)

#### 后端技术栈
- **语言**: Python 3.11+
- **Web框架**: FastAPI
- **ASGI服务器**: Uvicorn
- **ORM**: SQLAlchemy 2.0
- **数据库迁移**: Alembic
- **身份认证**: python-jose (JWT)
- **数据验证**: Pydantic
- **数据库**: PostgreSQL 14+ / MySQL 8.0
- **API文档**: OpenAPI 3.0 (自动生成)
- **包管理**: Poetry / pip
- **测试框架**: pytest
- **异步支持**: asyncio, asyncpg

#### 基础设施
- **Web服务器**: Nginx
- **ASGI服务器**: Uvicorn
- **数据库**: PostgreSQL/MySQL
- **缓存**: Redis (Phase 2)
- **文件存储**: 本地存储 / 云存储 (Phase 2)
- **容器化**: Docker
- **进程管理**: Supervisor / systemd

## 系统模块划分

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

## 数据流

### 用户认证流程
```
用户登录 → 前端验证 → 后端验证 → 生成JWT Token → 返回用户信息 → 前端存储Token
```

### 课程学习流程
```
选择课程 → 验证权限 → 加载课程内容 → 记录学习进度 → 更新完成状态
```

## 安全设计

### 身份认证
- JWT Token 认证 (python-jose)
- 密码加密存储 (passlib + bcrypt)
- 登录失败限制
- OAuth2 兼容的认证流程

### 权限控制
- 基于角色的访问控制 (RBAC)
- FastAPI Depends 依赖注入权限验证
- 装饰器模式的权限控制
- 前端路由权限控制

### 数据安全
- Pydantic 数据模型验证
- SQLAlchemy ORM 防 SQL 注入
- CORS 跨域配置
- XSS攻击防护
- CSRF防护

## 性能考虑

### 前端优化
- 组件懒加载
- 图片懒加载
- 代码分割
- 静态资源压缩

### 后端优化
- SQLAlchemy 连接池管理
- 异步数据库操作 (asyncpg/aiomysql)
- 查询优化与索引
- 分页查询 (offset/cursor based)
- Gzip 响应压缩
- 后台任务处理 (Celery - Phase 2)

## 部署架构

### 开发环境
```
本地开发 → Git仓库 → 本地测试环境
```

### 生产环境
```
代码提交 → CI/CD → 测试环境 → 生产环境部署
```

## 扩展性设计

### 水平扩展
- 无状态应用设计
- 负载均衡支持
- 数据库读写分离 (Phase 2)

### 功能扩展
- 模块化设计
- 插件化架构预留
- API版本控制

## 监控与日志

### 应用监控
- 系统性能监控
- 错误日志收集
- 用户行为追踪

### 日志管理
- 结构化日志 (structlog)
- 日志级别控制
- 日志轮转策略

## Python 后端架构详细设计

### 项目结构
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI 应用入口
│   ├── core/
│   │   ├── config.py          # 配置管理
│   │   ├── security.py        # 安全相关
│   │   └── database.py        # 数据库连接
│   ├── api/
│   │   ├── deps.py            # 依赖注入
│   │   ├── auth.py            # 认证路由
│   │   ├── users.py           # 用户管理
│   │   └── courses.py         # 课程管理
│   ├── crud/                  # 数据库操作层
│   ├── models/                # SQLAlchemy 模型
│   ├── schemas/               # Pydantic 模型
│   └── utils/                 # 工具函数
├── alembic/                   # 数据库迁移
├── tests/                     # 测试文件
├── requirements.txt           # 依赖文件
└── Dockerfile                 # 容器化配置
```

### 核心组件

#### 1. FastAPI 应用配置
```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, users, courses
from app.core.config import settings

app = FastAPI(
    title="E-Learning Platform API",
    description="企业在线培训平台后端 API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_HOSTS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["认证"])
app.include_router(users.router, prefix="/api/users", tags=["用户"])
app.include_router(courses.router, prefix="/api/courses", tags=["课程"])
```

#### 2. 数据库模型示例
```python
from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    username = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255))
    is_active = Column(Boolean, default=True)
    role = Column(String(50), default="student")
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

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
```

#### 3. API 路由示例
```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.deps import get_current_user, get_db
from app.schemas.course import CourseCreate, CourseResponse
from app.crud.course import course_crud

router = APIRouter()

@router.post("/", response_model=CourseResponse)
async def create_course(
    course: CourseCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """创建新课程"""
    if current_user.role not in ["admin", "instructor"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="权限不足"
        )
    return await course_crud.create(db=db, obj_in=course)

@router.get("/", response_model=List[CourseResponse])
async def get_courses(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """获取课程列表"""
    return await course_crud.get_multi(db=db, skip=skip, limit=limit)
```

#### 4. 认证与权限
```python
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

### 部署配置

#### Docker 配置
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 环境配置
```python
from pydantic import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALLOWED_HOSTS: list = ["*"]
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### 测试策略

#### 单元测试
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_user():
    response = client.post(
        "/api/users/",
        json={"email": "test@example.com", "password": "testpass123"}
    )
    assert response.status_code == 200
    assert response.json()["email"] == "test@example.com"

def test_login():
    response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "testpass123"}
    )
    assert response.status_code == 200
    assert "access_token" in response.json()
```