"use client";

import { useEffect, useRef } from "react";

interface PriceFetcherProps {
  symbol: string;
  onPriceUpdate: (price: number) => void;
}

export default function PriceFetcher({ symbol, onPriceUpdate }: PriceFetcherProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const activeSymbolRef = useRef(symbol); // track the active symbol

  useEffect(() => {
    activeSymbolRef.current = symbol; // update ref when symbol changes

    const connect = () => {
      let ws: WebSocket;

      if (symbol.includes("XAU")) {
        // Finnhub WebSocket
        const apiKey = "d2u4nkpr01qo4hodt6a0d2u4nkpr01qo4hodt6ag";
        const endpoint = `wss://ws.finnhub.io?token=${apiKey}`;
        ws = new WebSocket(endpoint);
        wsRef.current = ws;

        ws.onopen = () => {
          ws.send(JSON.stringify({ type: "subscribe", symbol: "OANDA:XAU_USD" }));
          heartbeatIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "ping" }));
            }
          }, 30000);
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "trade" && data.data) {
            const latestTrade = data.data[data.data.length - 1];
            if (latestTrade.s === "OANDA:XAU_USD" && activeSymbolRef.current.includes("XAU")) {
              const price = parseFloat(latestTrade.p);
              if (!isNaN(price)) {
                onPriceUpdate(price);
              }
            }
          }
        };
      } else {
        // Binance WebSocket
        const endpoint = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`;
        ws = new WebSocket(endpoint);
        wsRef.current = ws;

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const price = parseFloat(data.p);
          // Only process if this message matches the current active symbol
          if (!isNaN(price) && data.s?.toLowerCase().includes(activeSymbolRef.current.toLowerCase())) {
            onPriceUpdate(price);
          }
        };
      }

      ws.onclose = () => {
        if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
        if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);

        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    if (wsRef.current) {
      try {
        // Attempt unsubscribe before closing (for Binance)
        if (!symbol.includes("XAU")) {
          wsRef.current.send(
            JSON.stringify({ method: "UNSUBSCRIBE", params: [`${symbol.toLowerCase()}usdt@trade`], id: 1 })
          );
        }
      } catch (_) {
        // ignore errors if socket already closed
      }
      wsRef.current.close();
    }

    connect();

    return () => {
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (heartbeatIntervalRef.current) clearInterval(heartbeatIntervalRef.current);
      if (wsRef.current) wsRef.current.close();
    };
  }, [symbol]);

  return null;
}
