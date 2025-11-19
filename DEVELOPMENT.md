# Development Guide

## Prerequisites

- Node.js 20+ installed
- PostgreSQL 15+ installed (or Docker)
- Redis 7+ installed (or Docker)
- npm package manager

## Initial Setup

### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd password-manager

# Install root dependencies
npm install

# Install all workspace dependencies
npm run install:all
```

### 2. Set Up Environment Variables

```bash
# Copy environment files
cp .env.example .env
cp client/.env.example client/.env
cp server/.env.example server/.env

# Edit .env files with your configuration
# Important: Change JWT_SECRET and SERVER_ENCRYPTION_KEY to secure random values
```

### 3. Start PostgreSQL and Redis

**Option A: Using Docker Compose (Recommended)**

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379

**Option B: Using Local Installation**

Make sure PostgreSQL and Redis are running on your system:

```bash
# Check PostgreSQL
psql -U postgres -c "SELECT version();"

# Check Redis
redis-cli ping
```

Create the database:

```bash
psql -U postgres
CREATE DATABASE passwordmanager;
\q
```

### 4. Build Shared Module

The shared module contains types and constants used by both client and server:

```bash
cd shared
npm run build
cd ..
```

### 5. Database Setup

The database will auto-sync in development mode when you start the server:

```bash
npm run dev:server
```

The models will automatically create the necessary tables.

### 6. Start Development Servers

**Option A: Start All Services**

```bash
# From root directory
npm run dev
```

This will concurrently start:
- Frontend (Vite) on http://localhost:5173
- Backend (Express) on http://localhost:3000

**Option B: Start Services Separately**

Terminal 1 - Backend:
```bash
npm run dev:server
```

Terminal 2 - Frontend:
```bash
npm run dev:client
```

## Development Workflow

### Project Structure

```
password-manager/
├── client/          # Frontend React application
├── server/          # Backend Express application
├── shared/          # Shared types and constants
└── package.json     # Root package.json for monorepo
```

### Available Scripts

#### Root Level
- `npm run dev` - Start both client and server
- `npm run dev:client` - Start frontend only
- `npm run dev:server` - Start backend only
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages

#### Client (Frontend)
- `cd client && npm run dev` - Start Vite dev server
- `cd client && npm run build` - Build for production
- `cd client && npm run preview` - Preview production build

#### Server (Backend)
- `cd server && npm run dev` - Start with nodemon
- `cd server && npm run build` - Compile TypeScript
- `cd server && npm run start` - Start production server

### Database Management

The application uses Sequelize ORM with PostgreSQL.

**View Database Tables:**

```bash
psql -U postgres -d passwordmanager
\dt
```

**Reset Database (Development Only):**

```bash
psql -U postgres -d passwordmanager
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
\q

# Restart server to re-sync models
npm run dev:server
```

### Adding New Features

#### 1. Add Shared Types

Edit `shared/types/index.ts` to add new interfaces:

```typescript
export interface NewFeature {
  id: string;
  name: string;
  // ... other fields
}
```

Rebuild shared module:
```bash
cd shared && npm run build
```

#### 2. Add Database Model

Create `server/src/models/NewModel.ts`:

```typescript
import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/database';

class NewModel extends Model {
  // ... model definition
}

NewModel.init({ /* fields */ }, { sequelize });
export default NewModel;
```

Add to `server/src/models/index.ts`:
```typescript
import NewModel from './NewModel';
export { NewModel };
```

#### 3. Add API Endpoints

- Create controller in `server/src/controllers/`
- Create route in `server/src/routes/`
- Add route to `server/src/routes/index.ts`

#### 4. Add Frontend Feature

- Create components in `client/src/features/[feature-name]/`
- Add API calls in `client/src/features/[feature-name]/api/`
- Add hooks in `client/src/features/[feature-name]/hooks/`
- Add pages in `client/src/features/[feature-name]/pages/`

### Debugging

#### Backend Debugging

Add breakpoints and debug with:

```bash
cd server
node --inspect -r ts-node/register src/server.ts
```

Then attach your debugger (VS Code, Chrome DevTools, etc.)

#### Frontend Debugging

Use browser DevTools. Vite provides source maps automatically in development.

#### Database Debugging

Enable SQL logging by setting in `server/src/config/database.ts`:

```typescript
logging: console.log  // Shows all SQL queries
```

### Testing API Endpoints

Use tools like:
- Postman
- Thunder Client (VS Code extension)
- curl

Example:

```bash
# Health check
curl http://localhost:3000/health

# API health check
curl http://localhost:3000/api/health
```

### Common Issues and Solutions

#### Issue: Port Already in Use

```bash
# Find and kill process using port 3000
lsof -ti:3000 | xargs kill -9

# Find and kill process using port 5173
lsof -ti:5173 | xargs kill -9
```

#### Issue: Database Connection Failed

- Verify PostgreSQL is running: `psql -U postgres -c "SELECT 1;"`
- Check DATABASE_URL in `.env`
- Ensure database exists: `psql -U postgres -l`

#### Issue: Redis Connection Failed

- Verify Redis is running: `redis-cli ping`
- Check REDIS_URL in `.env`

#### Issue: Module Not Found Errors

```bash
# Clean install all dependencies
rm -rf node_modules client/node_modules server/node_modules shared/node_modules
npm run install:all
```

#### Issue: TypeScript Errors

```bash
# Rebuild shared module
cd shared && npm run build

# Rebuild server
cd server && npm run build
```

## Production Build

### Build All Packages

```bash
npm run build
```

This will:
1. Build shared module
2. Build client (Vite)
3. Build server (TypeScript)

### Start Production Server

```bash
NODE_ENV=production npm start
```

### Environment Variables for Production

Make sure to set secure values for:
- `JWT_SECRET` - Random 32+ character string
- `REFRESH_TOKEN_SECRET` - Random 32+ character string
- `SERVER_ENCRYPTION_KEY` - Random 32-byte key
- `DATABASE_URL` - Production database URL
- `REDIS_URL` - Production Redis URL

## Code Style and Linting

The project uses ESLint and TypeScript strict mode.

```bash
# Run linting
npm run lint

# Auto-fix issues
cd client && npm run lint -- --fix
cd server && npm run lint -- --fix
```

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push to repository
git push origin feature/your-feature-name
```

## Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Sequelize Documentation](https://sequelize.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [shadcn/ui Documentation](https://ui.shadcn.com/)

## Getting Help

- Check existing issues in the repository
- Review error logs in `server/logs/`
- Enable debug logging in development
