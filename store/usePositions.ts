import { create } from "zustand";

type Store = {
  currentPrice: number;
  btc: {
    currentPrice: number;
    lastPriceUpdate: number;
  };
  eth: {
    currentPrice: number;
    lastPriceUpdate: number;
  };
  sol: {
    currentPrice: number;
    lastPriceUpdate: number;
  };
  xauusd: {
    currentPrice: number;
    lastPriceUpdate: number;
  };
  overallPnl: number;
  selectedCryptoPnl: number;
  lastPriceUpdate: number;
  setCurrentPrice: (price: number) => void;
  setOverallPnl: (pnl: number) => void;
  setEthPrice: (price: number) => void;
  setSolPrice: (price: number) => void;
  setXauPrice: (price: number) => void;
  setBtcPrice: (price: number) => void;
};

const PRICE_CHANGE_THRESHOLD = 0.01; // 0.01% change required to trigger update

function shouldUpdatePrice(
  currentPrice: number,
  price: number,
  lastPriceUpdate: number,
): boolean {
  const now = Date.now();

  const percentChange =
    currentPrice > 0 ? (price - currentPrice) / currentPrice : 100;

  const shouldUpdate =
    percentChange >= PRICE_CHANGE_THRESHOLD || now - lastPriceUpdate > 500;

  return shouldUpdate;
}

const usePositions = create<Store>()((set, get) => ({
  overallPnl: 0,
  setOverallPnl: (pnl) => {
    const current = get().overallPnl;
    // Only update if there's a meaningful change
    if (Math.abs(current - pnl) > 0.001) {
      set(() => ({ overallPnl: pnl }));
    }
  },
  selectedCryptoPnl: 0,
  currentPrice: 0,
  lastPriceUpdate: 0,
  setCurrentPrice: (price) => {
    const { currentPrice, lastPriceUpdate } = get();
    const now = Date.now();

    // Calculate percentage change
    const percentChange =
      currentPrice > 0
        ? Math.abs(((price - currentPrice) / currentPrice) * 100)
        : 100;

    // Only update if price changed significantly OR enough time has passed (500ms)
    const shouldUpdate =
      percentChange >= PRICE_CHANGE_THRESHOLD || now - lastPriceUpdate > 500;

    if (shouldUpdate) {
      set(() => ({
        currentPrice: price,
        lastPriceUpdate: now,
      }));
    }
  },
  eth: {
    currentPrice: 0,
    lastPriceUpdate: 0,
  },
  sol: {
    currentPrice: 0,
    lastPriceUpdate: 0,
  },
  xauusd: {
    currentPrice: 0,
    lastPriceUpdate: 0,
  },
  btc: {
    currentPrice: 0,
    lastPriceUpdate: 0,
  },
  setEthPrice: (price: number) => {
    const { eth } = get();
    const { lastPriceUpdate, currentPrice } = eth;
    const now = Date.now();
    const shouldUpdate = shouldUpdatePrice(
      currentPrice,
      price,
      lastPriceUpdate,
    );
    if (shouldUpdate) {
      set(() => ({
        eth: {
          currentPrice: price,
          lastPriceUpdate: now,
        },
      }));
    }
  },
  setSolPrice: (price: number) => {
    const { sol } = get();
    const { lastPriceUpdate, currentPrice } = sol;
    const now = Date.now();
    const shouldUpdate = shouldUpdatePrice(
      currentPrice,
      price,
      lastPriceUpdate,
    );
    if (shouldUpdate) {
      set(() => ({
        sol: {
          currentPrice: price,
          lastPriceUpdate: now,
        },
      }));
    }
  },
  setXauPrice: (price: number) => {
    const { xauusd } = get();
    const { lastPriceUpdate, currentPrice } = xauusd;
    const now = Date.now();
    const shouldUpdate = shouldUpdatePrice(
      currentPrice,
      price,
      lastPriceUpdate,
    );
    if (shouldUpdate) {
      set(() => ({
        xauusd: {
          currentPrice: price,
          lastPriceUpdate: now,
        },
      }));
    }
  },
  setBtcPrice: (price: number) => {
    const { btc } = get();
    const { lastPriceUpdate, currentPrice } = btc;
    const now = Date.now();
    const shouldUpdate = shouldUpdatePrice(
      currentPrice,
      price,
      lastPriceUpdate,
    );
    if (shouldUpdate) {
      set(() => ({
        btc: {
          currentPrice: price,
          lastPriceUpdate: now,
        },
      }));
    }
  },
}));

// Selectors for optimal re-render control
export const useCurrentPrice = () =>
  usePositions((state) => state.currentPrice);
export const useOverallPnl = () => usePositions((state) => state.overallPnl);
export const useCurrentEthPrice = () =>
  usePositions((state) => state.eth.currentPrice);
export const useCurrentBtcPrice = () =>
  usePositions((state) => state.btc.currentPrice);
export const useCurrentSolPrice = () =>
  usePositions((state) => state.sol.currentPrice);
export const useCurrentXauPrice = () =>
  usePositions((state) => state.xauusd.currentPrice);

export const useCurrentPrices =()=>({
  eth: usePositions((state) => state.eth.currentPrice),
  btc: usePositions((state) => state.btc.currentPrice),
  sol: usePositions((state) => state.sol.currentPrice),
  xauusd: usePositions((state) => state.xauusd.currentPrice),
})

// Selector for multiple values
export const usePositionsData = () => {
  const currentPrice = usePositions((state) => state.currentPrice);
  const overallPnl = usePositions((state) => state.overallPnl);

  return { currentPrice, overallPnl, };
};

export default usePositions;
