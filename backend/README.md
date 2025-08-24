# Backend Project Structure

This directory will contain the Spring Boot backend application.

## Planned Structure

```
backend/
├── pom.xml                  # Maven configuration
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/contoso/elearning/
│   │   │       ├── ELearningApplication.java
│   │   │       ├── config/          # Configuration classes
│   │   │       ├── controller/      # REST controllers
│   │   │       ├── service/         # Business logic
│   │   │       ├── repository/      # Data access layer
│   │   │       ├── entity/          # JPA entities
│   │   │       ├── dto/             # Data transfer objects
│   │   │       ├── security/        # Security configuration
│   │   │       └── exception/       # Exception handling
│   │   └── resources/
│   │       ├── application.yml      # Application configuration
│   │       └── db/migration/        # Flyway migration scripts
│   └── test/                        # Test classes
└── target/                          # Build output
```

## Key Technologies

- Spring Boot 3.x
- Spring Security with JWT
- Spring Data JPA
- MySQL 8.0
- Flyway for database migrations
- Maven for build management
- OpenAPI 3.0 for API documentation

## Development Commands

```bash
# Install dependencies and run tests
./mvnw clean install

# Start development server
./mvnw spring-boot:run

# Run tests only
./mvnw test

# Package application
./mvnw clean package
```

## API Endpoints

- Authentication: `/api/v1/auth/**`
- Users: `/api/v1/users/**`
- Courses: `/api/v1/courses/**`
- Enrollments: `/api/v1/enrollments/**`
- Admin: `/api/v1/admin/**`

This structure will be implemented in the next phase of development.