# Environment Plan v1.0

## Overview
Three environments separate development work from testing and live data.

## Development (Local)
**Purpose**: Daily coding and testing on your laptop.

| Setting | Value |
|---|---|
| Node.js App | `localhost:3001` |
| Frontend | `localhost:3000` |
| Database | `pms_dev` (local MySQL) |
| Node Env | `development` |
| Debug Logging | Enabled |
| JWT Secret | Test key (rotate before staging) |

**MySQL Workbench**: Connect to `localhost:3306` → `pms_dev`

## Staging
**Purpose**: Final testing before production release.

| Setting | Value |
|---|---|
| Backend URL | `https://pms-staging.mattfen0.com/api` |
| Frontend URL | `https://pms-staging.mattfen0.com` |
| Database | `pms_staging` (hosted MySQL) |
| Node Env | `staging` |
| Debug Logging | Disabled |
| JWT Secret | Staging key (rotate regularly) |

## Production
**Purpose**: Live customer-facing system.

| Setting | Value |
|---|---|
| Backend URL | `https://pms.mattfen0.com/api` |
| Frontend URL | `https://pms.mattfen0.com` |
| Database | `pms_production` (hosted MySQL) |
| Node Env | `production` |
| Debug Logging | Disabled |
| JWT Secret | Production key (managed in secrets manager) |

## Environment Variables

### Backend (`.env.example`)
Required for all environments
NODE_ENV=development
PORT=3001
DB_HOST=localhost
DB_PORT=3306
DB_NAME=pms_dev
DB_USER=root
DB_PASSWORD=yourpassword

Auth
JWT_SECRET=your-super-secret-key-change-this
JWT_EXPIRES=7d

CORS (update for staging/prod)
FRONTEND_URL=http://localhost:3000

### Frontend (`.env.example`)
VITE_API_URL=http://localhost:3001/api
VITE_APP_NAME="PMS Development"

## Deployment Flow

## Security Rules
- Never commit `.env` files
- Rotate JWT secrets monthly
- Production database daily backups
- Staging data copied from production (anonymized)
