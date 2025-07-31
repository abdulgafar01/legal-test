import { create } from 'zustand';

type AccountType = 'professional' | 'service-seeker' | 'guest' | null;

interface AccountTypeStore {
  accountType: AccountType;
  setAccountType: (type: AccountType) => void;
}

// Read from localStorage on load
const getInitialAccountType = (): AccountType => {
  if (typeof window === 'undefined') return null; // SSR check
  return (localStorage.getItem('accountType') as AccountType) || null;
};

export const useAccountTypeStore = create<AccountTypeStore>((set) => ({
  accountType: getInitialAccountType(),
  setAccountType: (type) => {
    // Save to localStorage
    if (typeof window !== 'undefined' && type) {
      localStorage.setItem('accountType', type);
    }
    set({ accountType: type });
  },
}));
