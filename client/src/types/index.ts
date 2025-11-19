export * from '@shared/types';

// Additional client-specific types can be added here
export interface PasswordFormData {
  title: string;
  username?: string;
  password: string;
  url?: string;
  notes?: string;
  customFields?: Array<{ name: string; value: string; type: string }>;
  category?: string;
  tags?: string[];
  icon?: string;
  color?: string;
}

export interface VaultFormData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}
