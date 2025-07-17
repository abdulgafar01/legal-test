import { create } from 'zustand';

type AccountType = 'professional' | 'service-seeker' | 'guest' | null;

interface AccountTypeStore {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
}

export const useAccountTypeStore = create<AccountTypeStore>((set) => ({
  accountType: null,
  setAccountType: (type) => set({ accountType: type }),
}));
