import usePositions from "@/store/usePositions";
import { useEffect, useRef, useCallback, useState } from "react";
import { Order, Symbols, SymbolsUpperCase } from "@/types";

interface PriceFetcherProps {
  symbol: SymbolsUpperCase | "";
  orders: Order[];
}

const FINNHUB_API_KEY =
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY ||
  "d2u4nkpr01qo4hodt6a0d2u4nkpr01qo4hodt6ag";
const RECONNECT_DELAY = 3000;
const HEARTBEAT_INTERVAL = 30000;
const MAX_RECONNECT_ATTEMPTS = 5;
// Calculate P/L at most every 250ms

export default function usePriceFetcher({ symbol, orders }: PriceFetcherProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeSymbolRef = useRef<SymbolsUpperCase | "">("");
  const reconnectAttemptsRef = useRef(0);
  const lastPriceRef = useRef<{
    xauusd: number;
    btc: number;
    eth: number;
    sol: number;
  }>({
    xauusd: 0,
    btc: 0,
    eth: 0,
    sol: 0,
  });
  const ordersRef = useRef(orders);
  const [openOrdersSymbolRef, setOpenOrdersSymbolRef] = useState<Symbols[]>([]);
  const subscribedSymbolsRef = useRef<Set<string>>(new Set());
  ordersRef.current = orders;

  useEffect(() => {
    const openOrders: Symbols[] = [];
    for (const order of orders) {
      const symbol = order.symbol.toLowerCase() as Symbols;
      if (order.status === "open" && !openOrders.includes(symbol)) {
        openOrders.push(symbol);
      }
    }
    setOpenOrdersSymbolRef(openOrders);
  }, [orders]);

  const { setBtcPrice, setEthPrice, setXauPrice, setSolPrice } = usePositions();

  const updatePrice = {
    eth: setEthPrice,
    btc: setBtcPrice,
    xauusd: setXauPrice,
    sol: setSolPrice,
  };

  const clearTimers = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (heartbeatIntervalRef.current) {
      clearInterval(heartbeatIntervalRef.current);
      heartbeatIntervalRef.current = null;
    }
  }, []);

  const handleFinnhubMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      if (data.type === "trade" && data.data?.length > 0) {
        const latestTrade = data.data[data.data.length - 1];
        const openOrdersHaveXAU = openOrdersSymbolRef.includes("xauusd");
        if (
          latestTrade.s === "OANDA:XAU_USD" &&
          ((activeSymbolRef.current &&
            activeSymbolRef.current.includes("XAU")) ||
            openOrdersHaveXAU)
        ) {
          const price = parseFloat(latestTrade.p);
          if (!isNaN(price)) {
            if (price === lastPriceRef.current.xauusd) return;

            updatePrice["xauusd"](price);
            lastPriceRef.current.xauusd = price;
          }
        }
      }
    } catch (error) {
      console.error("Error parsing Finnhub message:", error);
    }
  }, []);

  const handleBinanceMessage = useCallback((event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data);
      // Handle combined stream format
      const data = message.data || message;
      const price = parseFloat(data.p);
      const symbol = data.s?.toLowerCase().replace("usdt", "");

      if (!isNaN(price) && symbol) {
        // Update the price for the specific symbol
        if (updatePrice[symbol as Symbols]) {
          updatePrice[symbol as Symbols](price);
          lastPriceRef.current[symbol as Symbols] = price;
        }
      }
    } catch (error) {
      console.error("Error parsing Binance message:", error);
    }
  }, []);

  const wsToGold = () => {
    let ws;
    const endpoint = `wss://ws.finnhub.io?token=${FINNHUB_API_KEY}`;
    ws = new WebSocket(endpoint);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
      ws.send(JSON.stringify({ type: "subscribe", symbol: "OANDA:XAU_USD" }));
      heartbeatIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, HEARTBEAT_INTERVAL);
    };

    ws.onmessage = handleFinnhubMessage;
    return ws;
  };

  const wsToCrypto = (
    currentSymbol: string | null,
    openOrdersSymbols: string[] | null,
  ) => {
    let ws: WebSocket;
    // Get all non-XAU symbols from open orders and current symbol
    const symbolsToSubscribe = new Set<string>();
    if (currentSymbol && !currentSymbol.includes("xau")) {
      symbolsToSubscribe.add(currentSymbol.toLowerCase());
    }

    if (openOrdersSymbols && openOrdersSymbols.length > 0) {
      openOrdersSymbols.forEach((symbol) => {
        if (!symbol.includes("xau")) {
          symbolsToSubscribe.add(symbol);
        }
      });
    }

    symbolsToSubscribe.delete("xauusd");

    // Create streams for all symbols
    const streams = Array.from(symbolsToSubscribe)
      .map((sym) => `${sym}usdt@trade`)
      .join("/");
    const endpoint = `wss://stream.binance.com:9443/stream?streams=${streams}`;
    ws = new WebSocket(endpoint);
    wsRef.current = ws;

    ws.onopen = () => {
      reconnectAttemptsRef.current = 0;
      subscribedSymbolsRef.current = new Set(symbolsToSubscribe);
    };

    ws.onmessage = handleBinanceMessage;
    return ws;
  };

  const connect = useCallback(() => {
    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      console.error("Max reconnection attempts reached");
      return;
    }

    let ws: WebSocket | null;
    const currentSymbol = activeSymbolRef.current;
    const openOrdersHaveXAU = openOrdersSymbolRef.includes("xauusd");
    const openOrdersHaveCrypto = openOrdersSymbolRef.some((symbol) =>
      ["eth", "sol", "btc"].includes(symbol),
    );

    if (openOrdersSymbolRef.length > 0 && openOrdersHaveCrypto) {
      ws = wsToCrypto(null, openOrdersSymbolRef);
    }

    if ((currentSymbol && currentSymbol.includes("XAU")) || openOrdersHaveXAU) {
      ws = wsToGold();
    } else {
      ws = wsToCrypto(currentSymbol, null);
    }

    if (ws) {
      ws.onclose = () => {
        clearTimers();
        reconnectAttemptsRef.current++;

        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, RECONNECT_DELAY);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    }
  }, [
    handleFinnhubMessage,
    handleBinanceMessage,
    clearTimers,
    openOrdersSymbolRef,
  ]);

  // Handle unsubscribing from removed symbols
  useEffect(() => {
    if (
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN ||
      !symbol
    )
      return;

    const currentSymbol = symbol.toLowerCase();
    const currentOpenOrderSymbols = new Set<string>([currentSymbol]);

    openOrdersSymbolRef.forEach((sym) => {
      if (sym !== "xauusd") {
        currentOpenOrderSymbols.add(sym);
      }
    });

    // Find symbols that were subscribed but are no longer needed
    const symbolsToUnsubscribe: string[] = [];
    subscribedSymbolsRef.current.forEach((subscribedSym) => {
      if (!currentOpenOrderSymbols.has(subscribedSym)) {
        symbolsToUnsubscribe.push(subscribedSym);
      }
    });

    // Unsubscribe from removed symbols
    if (symbolsToUnsubscribe.length > 0 && !symbol.includes("XAU")) {
      console.log("Unsubscribing from:", symbolsToUnsubscribe);

      // Binance doesn't support unsubscribe on combined streams
      // We need to close and reconnect with new streams
      wsRef.current.close();
      connect();
    }
  }, [orders, symbol, connect]);

  useEffect(() => {
    activeSymbolRef.current = symbol;
    reconnectAttemptsRef.current = 0;

    if (wsRef.current) {
      wsRef.current.close();
    }

    connect();

    return () => {
      clearTimers();
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [symbol, connect, clearTimers]);

  return null;
}
