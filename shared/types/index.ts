// User & Auth Types
export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  isTotpEnabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  masterPassword: string;
  deviceId?: string;
  deviceName?: string;
}

export interface RegisterData {
  email: string;
  masterPassword: string;
  firstName?: string;
  lastName?: string;
  kdfIterations?: number;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface TwoFactorRequiredResponse {
  requiresTwoFactor: true;
  email: string;
}

// Vault Types
export interface Vault {
  id: string;
  userId: string;
  teamId?: string;
  name: string;
  description?: string;
  type: 'personal' | 'shared';
  icon?: string;
  color?: string;
  itemCount: number;
  isFavorite: boolean;
  lastAccessedAt?: string;
  permission?: 'read' | 'write' | 'admin';
  encryptedVaultKey?: string;
  vaultKeyIv?: string;
  vaultKeyTag?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVaultData {
  name: string;
  description?: string;
  type: 'personal' | 'shared';
  teamId?: string;
  icon?: string;
  color?: string;
  encryptedVaultKey?: string;
  vaultKeyIv?: string;
  vaultKeyTag?: string;
}

// Password Types
export interface Password {
  id: string;
  vaultId: string;
  title: string;
  encryptedUsername?: string;
  usernameIv?: string;
  usernameTag?: string;
  encryptedPassword: string;
  passwordIv: string;
  passwordTag: string;
  encryptedUrl?: string;
  urlIv?: string;
  urlTag?: string;
  encryptedNotes?: string;
  notesIv?: string;
  notesTag?: string;
  encryptedCustomFields?: string;
  customFieldsIv?: string;
  customFieldsTag?: string;
  category?: string;
  tags: string[];
  icon?: string;
  color?: string;
  strength: number;
  isCompromised: boolean;
  lastUsedAt?: string;
  usageCount: number;
  expiresAt?: string;
  isFavorite: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface DecryptedPassword {
  id: string;
  vaultId: string;
  title: string;
  username?: string;
  password: string;
  url?: string;
  notes?: string;
  customFields?: CustomField[];
  category?: string;
  tags: string[];
  icon?: string;
  color?: string;
  strength: number;
  isCompromised: boolean;
  lastUsedAt?: string;
  usageCount: number;
  expiresAt?: string;
  isFavorite: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CustomField {
  name: string;
  value: string;
  type: 'text' | 'password' | 'email' | 'url';
}

export interface CreatePasswordData {
  title: string;
  encryptedUsername?: string;
  usernameIv?: string;
  usernameTag?: string;
  encryptedPassword: string;
  passwordIv: string;
  passwordTag: string;
  encryptedUrl?: string;
  urlIv?: string;
  urlTag?: string;
  encryptedNotes?: string;
  notesIv?: string;
  notesTag?: string;
  encryptedCustomFields?: string;
  customFieldsIv?: string;
  customFieldsTag?: string;
  category?: string;
  tags?: string[];
  icon?: string;
  color?: string;
  strength: number;
  expiresAt?: string;
  notifyBefore?: number;
}

// Team Types
export type UserRole = 'super_admin' | 'admin' | 'manager' | 'member' | 'viewer';

export interface Team {
  id: string;
  name: string;
  slug: string;
  description?: string;
  planType: 'free' | 'pro' | 'enterprise';
  maxMembers: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  id: string;
  userId: string;
  teamId: string;
  role: UserRole;
  status: 'pending' | 'active' | 'suspended';
  user: User;
  invitedBy?: string;
  invitedAt?: string;
  joinedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// Audit Log Types
export interface AuditLog {
  id: string;
  userId?: string;
  teamId?: string;
  action: string;
  resource: string;
  resourceId?: string;
  details: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure';
  errorMessage?: string;
  createdAt: string;
}

// Session Types
export interface Session {
  id: string;
  userId: string;
  deviceId?: string;
  deviceName?: string;
  deviceType?: string;
  browser?: string;
  os?: string;
  ipAddress?: string;
  location?: string;
  isTrusted: boolean;
  isCurrent?: boolean;
  lastActivityAt: string;
  expiresAt: string;
  createdAt: string;
}

// Export/Import Types
export interface ExportOptions {
  format: 'json' | 'csv';
  vaultIds?: string[];
  includeHistory?: boolean;
  exportPassword: string;
}

export interface ExportResult {
  exportId: string;
  downloadUrl: string;
  expiresAt: string;
  itemCount: number;
  fileSize: number;
}

export interface ImportOptions {
  format: 'json' | 'csv' | 'lastpass' | 'bitwarden' | '1password';
  vaultId: string;
  importPassword?: string;
  conflictResolution: 'skip' | 'overwrite' | 'duplicate';
  fieldMapping?: Record<string, string>;
}

export interface ImportResult {
  importId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  totalItems: number;
  successfulItems: number;
  failedItems: number;
  errors?: ImportError[];
  completedAt?: string;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
}

// Security Types
export interface SecurityDashboard {
  totalPasswords: number;
  weakPasswords: number;
  compromisedPasswords: number;
  reusedPasswords: number;
  expiredPasswords: number;
  expiringPasswords: number;
  averageStrength: number;
  lastSecurityCheck?: string;
  passwordStrengthDistribution: {
    weak: number;
    fair: number;
    good: number;
    strong: number;
  };
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  errors?: Record<string, string[]>;
}
