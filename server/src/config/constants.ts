export const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret';
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '15m';
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'your-refresh-secret';
export const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

export const MAX_LOGIN_ATTEMPTS = 5;
export const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

export const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW || '900000'); // 15 minutes
export const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX || '100');

export const SESSION_TIMEOUT = parseInt(process.env.SESSION_TIMEOUT || '900000'); // 15 minutes

export const ALLOWED_IMPORT_FORMATS = ['json', 'csv', 'lastpass', 'bitwarden', '1password'];
export const ALLOWED_EXPORT_FORMATS = ['json', 'csv'];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const BACKUP_CODE_COUNT = 10;
export const BACKUP_CODE_LENGTH = 8;
