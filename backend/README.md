# Backend Project Structure

This directory contains the Python FastAPI backend application.

## Planned Structure

```
backend/
├── requirements.txt         # Python dependencies
├── pyproject.toml          # Poetry configuration (optional)
├── .env                    # Environment variables
├── alembic.ini             # Alembic configuration
├── Dockerfile              # Docker configuration
├── app/
│   ├── __init__.py
│   ├── main.py             # FastAPI application entry point
│   ├── core/
│   │   ├── __init__.py
│   │   ├── config.py       # Application configuration
│   │   ├── security.py     # Authentication & security
│   │   ├── database.py     # Database connection
│   │   └── deps.py         # Dependency injection
│   ├── api/
│   │   ├── __init__.py
│   │   ├── auth.py         # Authentication endpoints
│   │   ├── users.py        # User management endpoints
│   │   ├── courses.py      # Course management endpoints
│   │   └── admin.py        # Admin endpoints
│   ├── crud/               # Database operations
│   │   ├── __init__.py
│   │   ├── base.py         # Base CRUD operations
│   │   ├── user.py         # User CRUD
│   │   └── course.py       # Course CRUD
│   ├── models/             # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── user.py         # User model
│   │   ├── course.py       # Course model
│   │   └── enrollment.py   # Enrollment model
│   ├── schemas/            # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── user.py         # User schemas
│   │   ├── course.py       # Course schemas
│   │   └── auth.py         # Authentication schemas
│   └── utils/              # Utility functions
│       ├── __init__.py
│       └── helpers.py
├── alembic/                # Database migrations
│   ├── versions/
│   └── env.py
└── tests/                  # Test files
    ├── __init__.py
    ├── conftest.py         # Test configuration
    ├── test_auth.py        # Authentication tests
    ├── test_users.py       # User tests
    └── test_courses.py     # Course tests
```

## Key Technologies

- Python 3.11+
- FastAPI - Modern, fast web framework
- SQLAlchemy 2.0 - ORM with async support
- Alembic - Database migrations
- Pydantic - Data validation using Python type annotations
- python-jose - JWT token handling
- passlib - Password hashing
- PostgreSQL/MySQL - Database
- pytest - Testing framework
- Uvicorn - ASGI server

## Development Commands

```bash
# Install dependencies
pip install -r requirements.txt
# or with Poetry
poetry install

# Start development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run database migrations
alembic upgrade head

# Create new migration
alembic revision --autogenerate -m "description"

# Run tests
pytest

# Run tests with coverage
pytest --cov=app tests/

# Format code
black app/ tests/
isort app/ tests/

# Type checking
mypy app/
```

## API Endpoints

- Authentication: `/api/auth/**`
- Users: `/api/users/**`
- Courses: `/api/courses/**`
- Enrollments: `/api/enrollments/**`
- Admin: `/api/admin/**`

## Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost/elearning_db
# or for MySQL
# DATABASE_URL=mysql://user:password@localhost/elearning_db

# Security
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_HOSTS=["http://localhost:3000", "http://127.0.0.1:3000"]
```

## API Documentation

Once the server is running, you can access:
- Interactive API docs (Swagger UI): http://localhost:8000/docs
- Alternative API docs (ReDoc): http://localhost:8000/redoc
- OpenAPI schema: http://localhost:8000/openapi.json

## Docker Deployment

```bash
# Build image
docker build -t elearning-backend .

# Run container
docker run -d -p 8000:8000 --env-file .env elearning-backend
```

This structure will be implemented in the next phase of development.