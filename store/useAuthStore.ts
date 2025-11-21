import { create } from "zustand";

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
};

const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}));

export default useAuthStore;
