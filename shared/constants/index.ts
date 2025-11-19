export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  MEMBER: 'member',
  VIEWER: 'viewer'
} as const;

export const PERMISSIONS = {
  super_admin: [
    'manage_team',
    'manage_members',
    'manage_roles',
    'manage_security_policies',
    'view_all_vaults',
    'manage_all_vaults',
    'view_audit_logs',
    'export_data',
    'delete_team'
  ],
  admin: [
    'manage_members',
    'assign_roles_except_super_admin',
    'view_team_vaults',
    'manage_team_vaults',
    'view_audit_logs',
    'export_data'
  ],
  manager: [
    'view_team_vaults',
    'create_vaults',
    'share_vaults',
    'view_limited_audit_logs'
  ],
  member: [
    'view_own_vaults',
    'create_vaults',
    'share_own_vaults',
    'view_shared_vaults'
  ],
  viewer: [
    'view_shared_vaults'
  ]
} as const;

export const PASSWORD_CATEGORIES = [
  'login',
  'credit_card',
  'identity',
  'note',
  'server',
  'database',
  'api_key',
  'license',
  'other'
] as const;

export const AUDIT_ACTIONS = {
  // Auth
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout',
  LOGIN_FAILED: 'login_failed',
  REGISTER: 'user_register',

  // Password
  PASSWORD_CREATED: 'password_created',
  PASSWORD_VIEWED: 'password_viewed',
  PASSWORD_COPIED: 'password_copied',
  PASSWORD_UPDATED: 'password_updated',
  PASSWORD_DELETED: 'password_deleted',
  PASSWORD_RESTORED: 'password_restored',

  // Vault
  VAULT_CREATED: 'vault_created',
  VAULT_UPDATED: 'vault_updated',
  VAULT_DELETED: 'vault_deleted',
  VAULT_SHARED: 'vault_shared',
  VAULT_UNSHARED: 'vault_unshared',

  // Team
  MEMBER_INVITED: 'member_invited',
  MEMBER_JOINED: 'member_joined',
  MEMBER_REMOVED: 'member_removed',
  ROLE_CHANGED: 'role_changed',

  // Export/Import
  EXPORT_INITIATED: 'export_initiated',
  EXPORT_DOWNLOADED: 'export_downloaded',
  IMPORT_INITIATED: 'import_initiated',
  IMPORT_COMPLETED: 'import_completed',

  // Security
  TWO_FA_ENABLED: '2fa_enabled',
  TWO_FA_DISABLED: '2fa_disabled',
  MASTER_PASSWORD_CHANGED: 'master_password_changed',
  SESSION_REVOKED: 'session_revoked'
} as const;

export const CRYPTO_CONFIG = {
  PBKDF2_ITERATIONS: 100000,
  AES_KEY_LENGTH: 256,
  RSA_KEY_LENGTH: 2048,
  SALT_LENGTH: 32,
  IV_LENGTH: 12
} as const;
