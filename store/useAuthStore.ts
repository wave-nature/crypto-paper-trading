import { create } from "zustand";
import useAccountHook from "@/hooks/useAccount";

interface User {
  id: string;
  email: string;
  name: string;
  balance: number;
  username: string;
  accountId: string;
}

type AuthState = {
  user: User | null;
  setUser: (user: User | null) => void;
  setBalance: (balance: number) => void;
};

const useAuthStore = create<AuthState>()((set, get) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
  setBalance: async (balance) => {
    const user = get().user;
    if (!user) return;
    const updatedBalance = user.balance + balance;
    const { updateAccount } = useAccountHook();
    try {
      // Update local state optimistically
      set((state) => ({
        user: state.user ? { ...state.user, balance: updatedBalance } : null,
      }));

      // Send API request
      updateAccount({
        accountId: user.accountId,
        balance: updatedBalance,
      });
    } catch (error) {
      console.error("Failed to update balance:", error);
      // Rollback on error
      set((state) => ({
        user: state.user ? { ...state.user, balance: user.balance } : null,
      }));
    }
  },
}));

export default useAuthStore;
