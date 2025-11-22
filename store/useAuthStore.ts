import { create } from "zustand";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";

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
    const supabase = createSupabaseBrowserClient();
    const user = get().user;
    if (!user) return;
    const updatedBalance = user.balance + balance;
    try {
      // Update local state on success
      set((state) => ({
        user: state.user ? { ...state.user, balance: updatedBalance } : null,
      }));

      // Send Supabase request
      const { error } = await supabase
        .from("accounts")
        .update({ balance: updatedBalance })
        .eq("id", user.accountId);

      if (error) throw error;
    } catch (error) {
      console.error("Failed to update balance:", error);
      // Optionally handle error (toast notification, etc.)
    }
  },
}));

export default useAuthStore;
