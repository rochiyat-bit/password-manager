import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@shared/types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  masterKey: CryptoKey | null;
  privateKey: string | null;
  isAuthenticated: boolean;

  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  setMasterKey: (key: CryptoKey | null) => void;
  setPrivateKey: (key: string | null) => void;
  logout: () => void;
}

export const authStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      masterKey: null,
      privateKey: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setTokens: (accessToken, refreshToken) =>
        set({ accessToken, refreshToken }),

      setMasterKey: (masterKey) => set({ masterKey }),

      setPrivateKey: (privateKey) => set({ privateKey }),

      logout: () => set({
        user: null,
        accessToken: null,
        refreshToken: null,
        masterKey: null,
        privateKey: null,
        isAuthenticated: false
      })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        privateKey: state.privateKey
      })
    }
  )
);
