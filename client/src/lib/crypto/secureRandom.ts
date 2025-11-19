/**
 * Secure random number and string generation utilities
 */
export class SecureRandom {
  /**
   * Generate cryptographically secure random bytes
   */
  generateBytes(length: number): Uint8Array {
    return crypto.getRandomValues(new Uint8Array(length));
  }

  /**
   * Generate secure random string with specified charset
   */
  generateString(length: number, charset: string): string {
    const bytes = this.generateBytes(length);
    let result = '';
    for (let i = 0; i < length; i++) {
      result += charset[bytes[i] % charset.length];
    }
    return result;
  }

  /**
   * Generate secure random hex string
   */
  generateHex(length: number): string {
    const bytes = this.generateBytes(Math.ceil(length / 2));
    return Array.from(bytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .slice(0, length);
  }

  /**
   * Generate secure random alphanumeric string
   */
  generateAlphanumeric(length: number): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return this.generateString(length, charset);
  }

  /**
   * Generate secure random numeric string
   */
  generateNumeric(length: number): string {
    const charset = '0123456789';
    return this.generateString(length, charset);
  }

  /**
   * Generate device ID
   */
  generateDeviceId(): string {
    return this.generateHex(32);
  }

  /**
   * Generate random UUID v4
   */
  generateUUID(): string {
    const bytes = this.generateBytes(16);

    // Set version (4) and variant bits
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;

    const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');

    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
  }
}

export const secureRandom = new SecureRandom();
