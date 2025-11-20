import { create } from "zustand";

type AuthState = {
  user: object | null;
  setUser: (user: object | null) => void;
};

const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user })),
}));

export default useAuthStore
