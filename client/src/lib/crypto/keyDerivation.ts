import { CRYPTO_CONFIG } from '@shared/constants';
import { encryptionService } from './encryption';

/**
 * Key derivation utilities
 */
export class KeyDerivation {
  /**
   * Derive master key from master password
   */
  async deriveMasterKey(
    masterPassword: string,
    email: string
  ): Promise<{ masterKey: CryptoKey; salt: string }> {
    // Use email as part of salt to ensure uniqueness
    const salt = await this.generateSalt(email);
    const masterKey = await encryptionService.deriveMasterKey(
      masterPassword,
      salt,
      CRYPTO_CONFIG.PBKDF2_ITERATIONS
    );

    return { masterKey, salt };
  }

  /**
   * Derive master key with existing salt
   */
  async deriveMasterKeyWithSalt(
    masterPassword: string,
    salt: string,
    iterations: number = CRYPTO_CONFIG.PBKDF2_ITERATIONS
  ): Promise<CryptoKey> {
    return await encryptionService.deriveMasterKey(
      masterPassword,
      salt,
      iterations
    );
  }

  /**
   * Generate deterministic salt from email
   */
  private async generateSalt(email: string): Promise<string> {
    // For consistency, we generate a deterministic salt based on email
    // This allows the same salt to be used across devices
    const encoder = new TextEncoder();
    const emailBuffer = encoder.encode(email.toLowerCase());
    const hashBuffer = await crypto.subtle.digest('SHA-256', emailBuffer);

    // Use first 32 bytes of hash as salt
    const saltArray = new Uint8Array(hashBuffer).slice(0, CRYPTO_CONFIG.SALT_LENGTH);
    return this.bufferToBase64(saltArray);
  }

  /**
   * Helper: Convert buffer to base64
   */
  private bufferToBase64(buffer: Uint8Array): string {
    let binary = '';
    for (let i = 0; i < buffer.byteLength; i++) {
      binary += String.fromCharCode(buffer[i]);
    }
    return btoa(binary);
  }

  /**
   * Create master password hash for server verification
   */
  async createMasterPasswordHash(
    masterKey: CryptoKey,
    masterPassword: string
  ): Promise<string> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(masterPassword);

    // Export master key
    const masterKeyRaw = await crypto.subtle.exportKey('raw', masterKey);

    // Combine master key and password
    const combined = new Uint8Array(masterKeyRaw.byteLength + passwordBuffer.byteLength);
    combined.set(new Uint8Array(masterKeyRaw), 0);
    combined.set(passwordBuffer, masterKeyRaw.byteLength);

    // Hash the combination
    const hashBuffer = await crypto.subtle.digest('SHA-256', combined);
    return this.bufferToBase64(new Uint8Array(hashBuffer));
  }
}

export const keyDerivation = new KeyDerivation();
