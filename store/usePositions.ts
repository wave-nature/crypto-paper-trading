import { create } from "zustand";

type Store = {
  pnl: number;
  setPnL: (pnl: number) => void;
};

const usePositions = create<Store>()((set) => ({
  pnl: 0,
  setPnL: (pnl) => set(() => ({ pnl })),
}));

export default usePositions
