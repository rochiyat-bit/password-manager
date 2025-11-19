import zxcvbn from 'zxcvbn';

/**
 * Calculate password strength
 * Returns a score from 0-100
 */
export function calculatePasswordStrength(password: string): number {
  if (!password) return 0;

  const result = zxcvbn(password);
  // zxcvbn score is 0-4, convert to 0-100
  return (result.score / 4) * 100;
}

/**
 * Get password strength label
 */
export function getPasswordStrengthLabel(strength: number): string {
  if (strength < 25) return 'Weak';
  if (strength < 50) return 'Fair';
  if (strength < 75) return 'Good';
  return 'Strong';
}

/**
 * Get password strength color
 */
export function getPasswordStrengthColor(strength: number): string {
  if (strength < 25) return 'text-red-500';
  if (strength < 50) return 'text-orange-500';
  if (strength < 75) return 'text-yellow-500';
  return 'text-green-500';
}

/**
 * Validate password requirements
 */
export function validatePasswordRequirements(password: string): {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
} {
  return {
    hasMinLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]/.test(password)
  };
}

/**
 * Check if password meets minimum requirements
 */
export function meetsPasswordRequirements(password: string): boolean {
  const requirements = validatePasswordRequirements(password);
  return Object.values(requirements).every(Boolean);
}

/**
 * Convert ArrayBuffer to base64
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Convert base64 to ArrayBuffer
 */
export function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Sanitize filename for export
 */
export function sanitizeFilename(filename: string): string {
  return filename.replace(/[^a-z0-9_\-\.]/gi, '_');
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
