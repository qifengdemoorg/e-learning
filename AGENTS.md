# Repository Guidelines

This guide outlines key conventions and commands for contributing to the E‑Learning Platform.

## Project Structure & Module Organization

```
e-learning/
├── README.md             # Project overview
├── docs/                 # Design and setup docs
├── frontend/             # Vue.js application
├── backend/              # Spring Boot service
├── database/             # SQL scripts and migrations
├── deployment/           # Docker, Kubernetes manifests
└── scripts/              # Utility and setup scripts
```

## Build, Test, and Development Commands

- `scripts/dev-setup.sh`        – bootstrap local dev environment (Docker, env files)
- `docker-compose -f docker-compose.dev.yml up -d` – start services
- `npm install && npm run dev`  – install frontend deps and launch dev server
- `./mvnw clean install && ./mvnw spring-boot:run` – build and run backend

## Coding Style & Naming Conventions

- Frontend: 2‑space indent, PascalCase component files, ESLint & Prettier
- Backend: 4‑space indent, standard Java naming, Maven Checkstyle plugin

## Testing Guidelines

- Frontend: Jest unit tests (`*.spec.ts`) and Playwright e2e tests (`npm run test:e2e`)
- Backend: JUnit tests under `backend/src/test/java` (`./mvnw test`)

## Commit & Pull Request Guidelines

- Use Conventional Commits (e.g. `feat:`, `fix:`, `docs:`)
- Branch names: `feature/*`, `bugfix/*`, `hotfix/*`
- PRs require a clear description, linked issue, and screenshots for UI changes

## Environment & Configuration Tips

- Copy `.env.example` to `.env` in both `frontend/` and `backend/` and adjust database/API URLs
- Apply migrations in `database/` before starting backend
