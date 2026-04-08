# Contributing Guidelines

This project follows clear standards for code quality, commits , and collaboration.

## Tech Stack 
- **Backend** : Node.js (ES Modules) + Express
- **Database**: MySQL (Workbench for design, migration for deployment)
- **Frontend**: [To be defined in Task 1.2]
- **Version Control**: Github Flow branching strategy

## Code Standards

## JavaScript / Node.js

- ES Modules ('import'/ 'export') only
- 'async/await' preferred over `.then()`
- Environment variables via   `.env` - never hardcoded
- Naming: `camelCase` (variables/functions), `PascalCase` (classes), `UPPER_SNAKE_CASE` (constraints)

## DATABASE (MYSQL)

- 'snake_case' for all table/column names
- Migration files: '001_create_users_table.sql'
- No raw SQL in controllers - use models/services

## Folder Structure
project-management-system/
├── backend/                  ← Node.js API (Express)
│   ├── src/
│   │   ├── controllers/      ← Route handlers
│   │   ├── routes/           ← API route definitions
│   │   ├── models/           ← DB query logic
│   │   ├── middleware/       ← Auth, error handling, RBAC
│   │   ├── services/         ← Business logic
│   │   └── utils/            ← Helpers, constants
│   ├── tests/
│   ├── .env.example
│   └── package.json
├── frontend/                 ← Your chosen frontend (React, Vue, etc.)
│   ├── src/
│   ├── public/
│   └── package.json
├── database/
│   ├── migrations/           ← SQL schema files (for Phase 2)
│   └── seeds/                ← Seed data scripts
├── docs/                     ← Specs, ERD, API docs
│   ├── specification.docx
│   └── development-plan.xlsx
├── .github/
│   └── workflows/            ← CI/CD pipelines (for task 1.5)
├── .gitignore
├── README.md
└── CONTRIBUTING.md


## Git Workflow (GitHub Flow)
- `main`: Production only
- `develop`: Integration branch
- `feature/[task-id]-description` : e.g. `feature/2.1-database-schema`
- PRs required for `main`/`develop` merges

## Commit Messages (Conventional Commits)
feath(auth): add login endpoint with JWT
fix(db): correct projects foreign key constraint
docs(readme): update installation steps
chore(deps): update eslint to latest
refactor(backend): extract auth middleware

## Pull request template
ALL PRs  must include:
- What does this change?
- Whis is this needed?
- Testing steps
- Related task ID (e.g. 3.1)

## Pre-Commit Hooks
Run before every commit: 
```bash
npm run lint
npm run format
npm run test
```
## Questions?
Ask in the [Planning Thread](link-to-this-thread).

