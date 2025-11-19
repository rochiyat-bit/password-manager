import { CRYPTO_CONFIG } from '@shared/constants';

class EncryptionService {
  /**
   * Derive encryption key from master password using PBKDF2
   */
  async deriveMasterKey(
    masterPassword: string,
    salt: string,
    iterations: number = CRYPTO_CONFIG.PBKDF2_ITERATIONS
  ): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const passwordBuffer = encoder.encode(masterPassword);
    const saltBuffer = this.base64ToBuffer(salt);

    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      passwordBuffer,
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBuffer,
        iterations,
        hash: 'SHA-256'
      },
      keyMaterial,
      {
        name: 'AES-GCM',
        length: CRYPTO_CONFIG.AES_KEY_LENGTH
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt data with AES-256-GCM
   */
  async encrypt(
    plaintext: string,
    key: CryptoKey
  ): Promise<{ ciphertext: string; iv: string; tag: string }> {
    const encoder = new TextEncoder();
    const data = encoder.encode(plaintext);

    // Generate random IV
    const iv = crypto.getRandomValues(new Uint8Array(CRYPTO_CONFIG.IV_LENGTH));

    // Encrypt
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv,
        tagLength: 128
      },
      key,
      data
    );

    const encryptedArray = new Uint8Array(encrypted);
    const ciphertext = encryptedArray.slice(0, -16);
    const tag = encryptedArray.slice(-16);

    return {
      ciphertext: this.bufferToBase64(ciphertext),
      iv: this.bufferToBase64(iv),
      tag: this.bufferToBase64(tag)
    };
  }

  /**
   * Decrypt data with AES-256-GCM
   */
  async decrypt(
    ciphertext: string,
    key: CryptoKey,
    iv: string,
    tag: string
  ): Promise<string> {
    const ciphertextBuffer = this.base64ToBuffer(ciphertext);
    const ivBuffer = this.base64ToBuffer(iv);
    const tagBuffer = this.base64ToBuffer(tag);

    // Combine ciphertext and tag
    const combined = new Uint8Array(ciphertextBuffer.byteLength + tagBuffer.byteLength);
    combined.set(new Uint8Array(ciphertextBuffer), 0);
    combined.set(new Uint8Array(tagBuffer), ciphertextBuffer.byteLength);

    try {
      const decrypted = await crypto.subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: ivBuffer,
          tagLength: 128
        },
        key,
        combined
      );

      const decoder = new TextDecoder();
      return decoder.decode(decrypted);
    } catch (error) {
      throw new Error('Decryption failed. Invalid key or corrupted data.');
    }
  }

  /**
   * Generate random salt
   */
  generateSalt(): string {
    const salt = crypto.getRandomValues(new Uint8Array(CRYPTO_CONFIG.SALT_LENGTH));
    return this.bufferToBase64(salt);
  }

  /**
   * Generate RSA key pair for vault sharing
   */
  async generateKeyPair(): Promise<{ publicKey: string; privateKey: string }> {
    const keyPair = await crypto.subtle.generateKey(
      {
        name: 'RSA-OAEP',
        modulusLength: CRYPTO_CONFIG.RSA_KEY_LENGTH,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: 'SHA-256'
      },
      true,
      ['encrypt', 'decrypt']
    );

    const publicKey = await crypto.subtle.exportKey('spki', keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

    return {
      publicKey: this.bufferToBase64(publicKey),
      privateKey: this.bufferToBase64(privateKey)
    };
  }

  /**
   * Generate a random vault key (AES-256)
   */
  async generateVaultKey(): Promise<CryptoKey> {
    return await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: CRYPTO_CONFIG.AES_KEY_LENGTH
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt vault key with public key (RSA)
   */
  async encryptVaultKey(vaultKey: CryptoKey, publicKeyString: string): Promise<string> {
    const publicKeyBuffer = this.base64ToBuffer(publicKeyString);
    const publicKey = await crypto.subtle.importKey(
      'spki',
      publicKeyBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['encrypt']
    );

    const vaultKeyRaw = await crypto.subtle.exportKey('raw', vaultKey);
    const encrypted = await crypto.subtle.encrypt(
      {
        name: 'RSA-OAEP'
      },
      publicKey,
      vaultKeyRaw
    );

    return this.bufferToBase64(encrypted);
  }

  /**
   * Decrypt vault key with private key (RSA)
   */
  async decryptVaultKey(
    encryptedVaultKey: string,
    privateKeyString: string
  ): Promise<CryptoKey> {
    const privateKeyBuffer = this.base64ToBuffer(privateKeyString);
    const privateKey = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      {
        name: 'RSA-OAEP',
        hash: 'SHA-256'
      },
      true,
      ['decrypt']
    );

    const encryptedBuffer = this.base64ToBuffer(encryptedVaultKey);
    const decrypted = await crypto.subtle.decrypt(
      {
        name: 'RSA-OAEP'
      },
      privateKey,
      encryptedBuffer
    );

    return await crypto.subtle.importKey(
      'raw',
      decrypted,
      {
        name: 'AES-GCM',
        length: CRYPTO_CONFIG.AES_KEY_LENGTH
      },
      true,
      ['encrypt', 'decrypt']
    );
  }

  /**
   * Encrypt private key with master key
   */
  async encryptPrivateKey(
    privateKey: string,
    masterKey: CryptoKey
  ): Promise<{ ciphertext: string; iv: string; tag: string }> {
    return await this.encrypt(privateKey, masterKey);
  }

  /**
   * Decrypt private key with master key
   */
  async decryptPrivateKey(
    encryptedPrivateKey: string,
    masterKey: CryptoKey,
    iv: string,
    tag: string
  ): Promise<string> {
    return await this.decrypt(encryptedPrivateKey, masterKey, iv, tag);
  }

  /**
   * Hash data with SHA-256
   */
  async hash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    return this.bufferToBase64(hashBuffer);
  }

  /**
   * Generate random password
   */
  generatePassword(length: number = 16, options: {
    uppercase?: boolean;
    lowercase?: boolean;
    numbers?: boolean;
    symbols?: boolean;
    excludeAmbiguous?: boolean;
  } = {}): string {
    const {
      uppercase = true,
      lowercase = true,
      numbers = true,
      symbols = true,
      excludeAmbiguous = false
    } = options;

    let charset = '';
    if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) charset += '0123456789';
    if (symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeAmbiguous) {
      charset = charset.replace(/[0O1lI]/g, '');
    }

    if (charset.length === 0) {
      throw new Error('At least one character type must be selected');
    }

    const randomValues = crypto.getRandomValues(new Uint8Array(length));
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset[randomValues[i] % charset.length];
    }

    return password;
  }

  /**
   * Helper: Convert buffer to base64
   */
  private bufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  /**
   * Helper: Convert base64 to buffer
   */
  private base64ToBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  /**
   * Export key to base64 string
   */
  async exportKey(key: CryptoKey): Promise<string> {
    const exported = await crypto.subtle.exportKey('raw', key);
    return this.bufferToBase64(exported);
  }

  /**
   * Import key from base64 string
   */
  async importKey(keyString: string): Promise<CryptoKey> {
    const keyBuffer = this.base64ToBuffer(keyString);
    return await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      {
        name: 'AES-GCM',
        length: CRYPTO_CONFIG.AES_KEY_LENGTH
      },
      true,
      ['encrypt', 'decrypt']
    );
  }
}

export const encryptionService = new EncryptionService();
