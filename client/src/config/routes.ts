export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  SETUP: '/setup',

  DASHBOARD: '/dashboard',

  VAULTS: '/vaults',
  VAULT_DETAIL: '/vaults/:id',

  PASSWORDS: '/passwords',
  PASSWORD_DETAIL: '/passwords/:id',

  TEAMS: '/teams',
  TEAM_DETAIL: '/teams/:id',
  TEAM_SETTINGS: '/teams/:id/settings',

  SECURITY: '/security',
  AUDIT_LOGS: '/security/audit-logs',
  SESSIONS: '/security/sessions',

  EXPORT_IMPORT: '/export-import',

  SETTINGS: '/settings',
  PROFILE: '/settings/profile',
  SECURITY_SETTINGS: '/settings/security',

  ADMIN: '/admin',
  ADMIN_POLICIES: '/admin/policies',
} as const;
