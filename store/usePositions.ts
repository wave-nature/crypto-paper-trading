import { create } from "zustand";

type Store = {
  pnl: number;
  currentPrice: number;
  overallPnl: number;
  lastPriceUpdate: number;
  setPnL: (pnl: number) => void;
  setCurrentPrice: (price: number) => void;
  setOverallPnl: (pnl: number) => void;
};

const PRICE_CHANGE_THRESHOLD = 0.01; // 0.01% change required to trigger update

const usePositions = create<Store>()((set, get) => ({
  pnl: 0,
  setPnL: (pnl) => set(() => ({ pnl })),
  overallPnl: 0,
  setOverallPnl: (pnl) => {
    const current = get().overallPnl;
    // Only update if there's a meaningful change
    if (Math.abs(current - pnl) > 0.001) {
      set(() => ({ overallPnl: pnl }));
    }
  },
  currentPrice: 0,
  lastPriceUpdate: 0,
  setCurrentPrice: (price) => {
    const { currentPrice, lastPriceUpdate } = get();
    const now = Date.now();

    // Calculate percentage change
    const percentChange = currentPrice > 0
      ? Math.abs((price - currentPrice) / currentPrice * 100)
      : 100;

    // Only update if price changed significantly OR enough time has passed (500ms)
    const shouldUpdate =
      percentChange >= PRICE_CHANGE_THRESHOLD ||
      (now - lastPriceUpdate) > 500;

    if (shouldUpdate) {
      set(() => ({
        currentPrice: price,
        lastPriceUpdate: now
      }));
    }
  },
}));

// Selectors for optimal re-render control
export const useCurrentPrice = () => usePositions((state) => state.currentPrice);
export const useOverallPnl = () => usePositions((state) => state.overallPnl);
export const usePnl = () => usePositions((state) => state.pnl);

// Selector for multiple values
export const usePositionsData = () => {
  const currentPrice = usePositions((state) => state.currentPrice);
  const overallPnl = usePositions((state) => state.overallPnl);
  const pnl = usePositions((state) => state.pnl);

  return { currentPrice, overallPnl, pnl };
};

export default usePositions;
