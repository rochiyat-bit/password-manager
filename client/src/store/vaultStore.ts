import { create } from 'zustand';

interface VaultState {
  selectedVaultId: string | null;
  vaultKeys: Map<string, CryptoKey>;

  setSelectedVaultId: (vaultId: string | null) => void;
  setVaultKey: (vaultId: string, key: CryptoKey) => void;
  getVaultKey: (vaultId: string) => CryptoKey | undefined;
  clearVaultKeys: () => void;
}

export const vaultStore = create<VaultState>((set, get) => ({
  selectedVaultId: null,
  vaultKeys: new Map(),

  setSelectedVaultId: (vaultId) => set({ selectedVaultId: vaultId }),

  setVaultKey: (vaultId, key) => set((state) => {
    const newKeys = new Map(state.vaultKeys);
    newKeys.set(vaultId, key);
    return { vaultKeys: newKeys };
  }),

  getVaultKey: (vaultId) => get().vaultKeys.get(vaultId),

  clearVaultKeys: () => set({ vaultKeys: new Map() })
}));
