# Password Manager - Architecture Documentation

## Overview

This is a fullstack password manager built with a **zero-knowledge encryption architecture**, meaning the server never has access to plaintext passwords or encryption keys. All sensitive data is encrypted client-side before being sent to the server.

## Technology Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + React Query
- **Routing**: React Router v6
- **Encryption**: Web Crypto API
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL 15+ with Sequelize ORM
- **Cache/Queue**: Redis 7+ with BullMQ
- **Authentication**: JWT + Argon2id
- **Security**: Helmet, CORS, Rate Limiting

### Infrastructure
- **Monorepo**: npm workspaces
- **Package Manager**: npm
- **Process Management**: PM2 (production)
- **Containerization**: Docker Compose

## Zero-Knowledge Encryption Architecture

### Key Concepts

1. **Master Password**: Never sent to server, never stored
2. **Master Key**: Derived from master password using PBKDF2 (100,000 iterations)
3. **Vault Keys**: Random AES-256 keys for each vault
4. **RSA Key Pairs**: For secure vault sharing between users

### Encryption Flow

#### User Registration
1. User enters email and master password
2. Client derives salt from email (deterministic)
3. Client derives master key from password + salt using PBKDF2
4. Client generates RSA key pair for sharing
5. Client encrypts private key with master key
6. Client hashes master key for server verification
7. Server stores: email, salt, master key hash, encrypted private key, public key

#### User Login
1. User enters email and master password
2. Client retrieves salt from server
3. Client derives master key from password + salt
4. Client hashes master key and sends to server
5. Server verifies hash matches stored hash
6. Server returns JWT tokens
7. Client decrypts private key with master key
8. Client stores master key and private key in memory (not localStorage)

#### Creating a Password
1. User creates/selects vault
2. Client generates random vault key (AES-256) if new vault
3. Client encrypts vault key with master key
4. Client encrypts password data with vault key
5. Server stores encrypted password and encrypted vault key

#### Retrieving a Password
1. Client requests encrypted password from server
2. Server returns encrypted password + encrypted vault key
3. Client decrypts vault key with master key
4. Client decrypts password with vault key
5. Plaintext password only exists in client memory

#### Sharing a Vault
1. Owner retrieves vault key (encrypted with their master key)
2. Owner decrypts vault key with their master key
3. Owner retrieves recipient's public key from server
4. Owner encrypts vault key with recipient's public key (RSA)
5. Server stores encrypted vault key for recipient
6. Recipient decrypts vault key with their private key
7. Recipient can now access vault passwords

### Security Layers

#### Layer 1: Transport Security
- HTTPS/TLS for all communications
- Certificate pinning (production)

#### Layer 2: Authentication
- JWT access tokens (15 min expiry)
- JWT refresh tokens (7 day expiry)
- Session management with device tracking
- 2FA with TOTP (Time-based One-Time Password)

#### Layer 3: Encryption
- **Master Key Derivation**: PBKDF2-SHA256, 100,000 iterations
- **Symmetric Encryption**: AES-256-GCM
- **Asymmetric Encryption**: RSA-OAEP-2048 (for vault sharing)
- **Password Hashing**: Argon2id (server-side)

#### Layer 4: Application Security
- Rate limiting on all endpoints
- CSRF protection
- XSS prevention
- SQL injection prevention (Sequelize ORM)
- Account lockout after failed attempts
- Audit logging for all actions

## Database Schema

### Core Tables

#### users
- Stores user accounts, authentication data
- Contains encrypted private key, public key
- Tracks login attempts, lockouts

#### teams
- Team/organization entities
- Links to security policies

#### user_teams
- Many-to-many relationship
- Stores user roles (super_admin, admin, manager, member, viewer)
- Tracks invitation status

#### vaults
- Password vaults (personal or shared)
- Belongs to user and optionally team

#### shared_vault_access
- Vault sharing permissions
- Stores encrypted vault key for each user

#### passwords
- Encrypted password entries
- All sensitive fields encrypted (username, password, url, notes, custom fields)

#### password_history
- Historical encrypted passwords
- Tracks password changes over time

#### sessions
- Active user sessions
- Device information, location tracking
- Session expiry management

#### audit_logs
- Complete audit trail
- Tracks all user actions
- Immutable log entries

### Supporting Tables

- **export_history**: Export job tracking
- **import_history**: Import job tracking
- **security_policies**: Team-level security policies

## API Architecture

### RESTful Endpoints

```
/api
  /auth
    POST /register
    POST /login
    POST /logout
    POST /refresh
    POST /2fa/setup
    POST /2fa/verify
    POST /2fa/disable

  /vaults
    GET    /
    POST   /
    GET    /:id
    PUT    /:id
    DELETE /:id
    POST   /:id/share
    DELETE /:id/share/:userId

  /passwords
    GET    /
    POST   /
    GET    /:id
    PUT    /:id
    DELETE /:id
    GET    /:id/history

  /teams
    GET    /
    POST   /
    GET    /:id
    PUT    /:id
    DELETE /:id
    POST   /:id/members
    DELETE /:id/members/:userId
    PUT    /:id/members/:userId/role

  /security
    GET    /dashboard
    GET    /sessions
    DELETE /sessions/:id
    GET    /audit-logs

  /export-import
    POST   /export
    GET    /export/:id/download
    POST   /import
    GET    /import/:id/status
```

### Response Format

Success:
```json
{
  "success": true,
  "data": { /* response data */ }
}
```

Error:
```json
{
  "success": false,
  "error": "Error message",
  "details": { /* optional error details */ }
}
```

## State Management

### Client State

#### Zustand Stores

1. **authStore**
   - User authentication state
   - Access/refresh tokens
   - Master key (in-memory only)
   - Private key (encrypted in localStorage)

2. **vaultStore**
   - Selected vault
   - Decrypted vault keys (in-memory only)

3. **uiStore**
   - UI preferences
   - Sidebar state
   - Theme

#### React Query
- Server state caching
- Automatic refetching
- Optimistic updates
- Background synchronization

### Server State

#### Redis
- Session storage
- Rate limiting counters
- Job queue management
- Cache for frequently accessed data

#### PostgreSQL
- Persistent data storage
- Relational data with foreign keys
- Full-text search capabilities

## Background Jobs

### BullMQ Queues

1. **exports**: Password export processing
2. **imports**: Password import processing
3. **breach-checks**: HaveIBeenPwned API checks
4. **notifications**: Email notifications

### Scheduled Tasks

- Password expiry notifications (daily)
- Breach database sync (weekly)
- Session cleanup (hourly)
- Export file cleanup (daily)

## Security Considerations

### Threat Model

**Protected Against:**
- Server compromise (zero-knowledge)
- Man-in-the-middle attacks (HTTPS)
- Brute force attacks (rate limiting, account lockout)
- Session hijacking (device tracking, trusted devices)
- SQL injection (ORM, parameterized queries)
- XSS attacks (React's built-in escaping, CSP headers)

**User Responsibilities:**
- Strong master password (cannot be reset)
- Secure device (malware could access decrypted data)
- Physical security (logged-in sessions)

### Data at Rest
- Database: Encrypted passwords (AES-256-GCM)
- Backups: Should be encrypted at storage level
- Exports: Optionally password-protected

### Data in Transit
- HTTPS/TLS 1.3
- Certificate validation
- No sensitive data in URLs

### Data in Use (Client Memory)
- Master key cleared on logout
- Vault keys cleared when switching vaults
- Clipboard cleared after password copy
- Auto-lock after inactivity

## Scalability

### Horizontal Scaling

- **API Servers**: Stateless, can run multiple instances
- **Database**: PostgreSQL read replicas
- **Redis**: Redis Cluster or Redis Sentinel
- **Background Jobs**: Multiple worker instances

### Caching Strategy

- **Database queries**: Redis cache with TTL
- **Static assets**: CDN
- **API responses**: HTTP caching headers

### Performance Optimizations

- Database indexing on frequently queried fields
- Pagination for large datasets
- Lazy loading of password lists
- Debounced search queries
- Connection pooling

## Deployment

### Production Checklist

- [ ] Set secure environment variables
- [ ] Enable SSL/TLS certificates
- [ ] Configure database backups
- [ ] Set up monitoring and logging
- [ ] Configure rate limiting
- [ ] Enable audit logging
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure CDN for static assets
- [ ] Set up health check endpoints
- [ ] Configure process manager (PM2)
- [ ] Set up firewall rules
- [ ] Configure Redis persistence
- [ ] Set up database migrations
- [ ] Configure CORS properly
- [ ] Enable security headers

### Recommended Architecture

```
[Load Balancer]
      |
      v
[API Servers (x2+)]
      |
      +----> [PostgreSQL Primary]
      |            |
      |            v
      |      [PostgreSQL Replicas]
      |
      +----> [Redis Cluster]
      |
      +----> [Background Workers (x2+)]
```

## Monitoring and Logging

### Metrics to Track

- API response times
- Error rates
- Database query performance
- Redis cache hit rate
- Background job success/failure rate
- Active sessions count
- Failed login attempts

### Logging

- **Application logs**: Winston (file + console)
- **Audit logs**: Database (immutable)
- **Error logs**: Separate file, error tracking service
- **Access logs**: Request/response logging

## Future Enhancements

1. **Mobile Applications**: iOS and Android apps
2. **Browser Extensions**: Auto-fill capabilities
3. **Biometric Authentication**: Touch ID, Face ID
4. **Hardware Security Keys**: U2F/WebAuthn support
5. **Advanced Sharing**: Temporary access, expiring shares
6. **File Attachments**: Secure document storage
7. **Emergency Access**: Designated emergency contacts
8. **Password Sharing Links**: One-time password shares
9. **API Access**: Developer API with OAuth
10. **Advanced Analytics**: Security insights, reports
