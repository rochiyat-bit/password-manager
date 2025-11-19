# Password Manager - Fullstack Application

A production-ready, secure password manager with zero-knowledge encryption architecture.

## Features

- **Zero-Knowledge Encryption**: Server never accesses plaintext passwords
- **Personal & Shared Vaults**: Organize passwords with team collaboration
- **Password Generator**: Strong, customizable password generation
- **Security Dashboard**: Monitor password health and compromised credentials
- **2FA Support**: Time-based one-time password authentication
- **Audit Logging**: Complete activity tracking
- **Export/Import**: Support for multiple formats (JSON, CSV, LastPass, Bitwarden, 1Password)
- **Team Management**: Role-based access control (Super Admin, Admin, Manager, Member, Viewer)

## Tech Stack

### Frontend
- React 18+ with TypeScript
- Vite 5+
- shadcn/ui + Radix UI + Tailwind CSS
- Zustand + React Query
- Web Crypto API for encryption

### Backend
- Node.js 20+ with Express
- TypeScript 5+
- PostgreSQL 15+ with Sequelize
- Redis 7+ with BullMQ
- JWT + Argon2id authentication

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+
- Redis 7+
- npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd password-manager
```

2. Install dependencies:
```bash
npm run install:all
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start PostgreSQL and Redis:
```bash
docker-compose up -d
```

5. Run database migrations:
```bash
npm run db:migrate
```

6. Start development servers:
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Project Structure

```
password-manager/
├── client/          # React frontend
├── server/          # Express backend
├── shared/          # Shared types and constants
└── docker-compose.yml
```

## Security Architecture

This password manager implements a **zero-knowledge architecture**:

1. **Master Password**: Never sent to the server
2. **Client-Side Encryption**: All sensitive data encrypted in browser
3. **Key Derivation**: PBKDF2 with 100,000+ iterations
4. **AES-256-GCM**: Authenticated encryption for all passwords
5. **RSA-2048**: Public key encryption for vault sharing
6. **No Plaintext Storage**: Server only stores encrypted data

## Scripts

- `npm run dev` - Start development servers (client + server)
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:migrate` - Run database migrations
- `npm run lint` - Lint all packages

## License

MIT

## Security

If you discover a security vulnerability, please email security@example.com.
