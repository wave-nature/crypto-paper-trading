import { create } from "zustand";

type Store = {
  pnl: number;
  setPnL: (pnl: number) => void;
};

const useStore = create<Store>()((set) => ({
  pnl: 0,
  setPnL: (pnl) => set(() => ({ pnl })),
}));

export default useStore
