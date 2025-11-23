"use client";

import useOrders from "@/store/useOrders";
import usePositions from "@/store/usePositions";
import { useEffect, useRef, useCallback } from "react";
import { throttle } from "@/utils/throttle";
import { Order } from "@/types";

interface PriceFetcherProps {
  symbol: string;
  orders: Order[];
}

const FINNHUB_API_KEY =
  process.env.NEXT_PUBLIC_FINNHUB_API_KEY ||
  "d2u4nkpr01qo4hodt6a0d2u4nkpr01qo4hodt6ag";
const RECONNECT_DELAY = 3000;
const HEARTBEAT_INTERVAL = 30000;
const MAX_RECONNECT_ATTEMPTS = 5;
const PNL_CALCULATION_THROTTLE = 250; // Calculate P/L at most every 250ms

export default function usePriceFetcher({ symbol, orders }: PriceFetcherProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeSymbolRef = useRef(symbol);
  const reconnectAttemptsRef = useRef(0);
  const lastPriceRef = useRef<number>(0);
  const ordersRef = useRef(orders);

  // Keep ordersRef in sync with latest orders
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  const { setOverallPnl, setCurrentPrice } = usePositions();

  // Throttled P&L calculation - using ref to access latest orders
  const calculatePnL = useRef(
    throttle((price: number) => {
      const currentOrders = ordersRef.current;

      if (currentOrders.some((order) => order.status === "open")) {
        const newPL = currentOrders.reduce((total, order) => {
          if (order.status === "open") {
            const diff = price - order.price;
            const orderPL =
              diff * order.quantity * (order.type === "buy" ? 1 : -1);
            return total + orderPL;
          }
          return total + (order.profit || 0);
        }, 0);

        setOverallPnl(newPL);
      }
    }, PNL_CALCULATION_THROTTLE)
  ).current;

  const priceUpdate = useCallback(
    (price: number) => {
      if (!price || price === lastPriceRef.current) return;

      lastPriceRef.current = price;
      setCurrentPrice(price);
      calculatePnL(price);
    },
    [setCurrentPrice, calculatePnL, setOverallPnl]
  );

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
        if (
          latestTrade.s === "OANDA:XAU_USD" &&
          activeSymbolRef.current.includes("XAU")
        ) {
          const price = parseFloat(latestTrade.p);
          if (!isNaN(price)) {
            priceUpdate(price);
          }
        }
      }
    } catch (error) {
      console.error("Error parsing Finnhub message:", error);
    }
  }, []);

  const handleBinanceMessage = useCallback((event: MessageEvent) => {
    try {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      if (
        !isNaN(price) &&
        data.s?.toLowerCase().includes(activeSymbolRef.current.toLowerCase())
      ) {
        priceUpdate(price);
      }
    } catch (error) {
      console.error("Error parsing Binance message:", error);
    }
  }, []);

  const connect = useCallback(() => {
    if (reconnectAttemptsRef.current >= MAX_RECONNECT_ATTEMPTS) {
      console.error("Max reconnection attempts reached");
      return;
    }

    let ws: WebSocket;
    const currentSymbol = activeSymbolRef.current;

    if (currentSymbol.includes("XAU")) {
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
    } else {
      const endpoint = `wss://stream.binance.com:9443/ws/${currentSymbol.toLowerCase()}usdt@trade`;
      ws = new WebSocket(endpoint);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectAttemptsRef.current = 0;
      };

      ws.onmessage = handleBinanceMessage;
    }

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
  }, [handleFinnhubMessage, handleBinanceMessage, clearTimers]);

  useEffect(() => {
    activeSymbolRef.current = symbol;
    reconnectAttemptsRef.current = 0;

    if (wsRef.current) {
      try {
        if (
          !symbol.includes("XAU") &&
          wsRef.current.readyState === WebSocket.OPEN
        ) {
          wsRef.current.send(
            JSON.stringify({
              method: "UNSUBSCRIBE",
              params: [`${symbol.toLowerCase()}usdt@trade`],
              id: 1,
            })
          );
        }
      } catch {
        // Ignore errors if socket already closed
      }
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
