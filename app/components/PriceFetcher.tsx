"use client";

import { useEffect, useRef } from "react";

interface PriceFetcherProps {
  symbol: string;
  onPriceUpdate: (price: number) => void;
}

export default function PriceFetcher({
  symbol,
  onPriceUpdate,
}: PriceFetcherProps) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const connect = () => {
      let ws: WebSocket;
      if (symbol.includes("XAU")) {
        // Finnhub WebSocket for XAU/USD (replace with your actual API key)
        const apiKey = "d2u4nkpr01qo4hodt6a0d2u4nkpr01qo4hodt6ag"; // Get free key from finnhub.io
        const endpoint = `wss://ws.finnhub.io?token=${apiKey}`;
        ws = new WebSocket(endpoint);
        wsRef.current = ws;

        ws.onopen = () => {
          // Subscribe to the symbol (use OANDA:XAU_USD for gold; confirm via their forex symbols API if needed)
          ws.send(
            JSON.stringify({ type: "subscribe", symbol: "OANDA:XAU_USD" })
          );
          // Start heartbeat (ping every 30s to maintain connection)
          heartbeatIntervalRef.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ type: "ping" }));
            }
          }, 30000);
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.type === "trade" && data.data) {
            // Finnhub sends arrays of trades; take the latest price (p)
            const latestTrade = data.data[data.data.length - 1];
            if (latestTrade.s === "OANDA:XAU_USD") {
              const price = parseFloat(latestTrade.p);
              if (!isNaN(price)) {
                onPriceUpdate(price);
              }
            }
          } else if (data.type === "ping" || data.type === "pong") {
            // Handle heartbeat responses if needed
          }
        };
      } else {
        // Existing Binance logic for crypto
        const endpoint = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`;
        ws = new WebSocket(endpoint);
        wsRef.current = ws;

        ws.onopen = () => {
          // console.log(`WebSocket connected to ${symbol}`);
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);
          const price = parseFloat(data.p);
          if (!isNaN(price) && data.s?.includes(symbol)) {
            onPriceUpdate(price);
          }
        };
      }

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        ws.close(); // This will trigger onclose and the reconnect logic
      };

      ws.onclose = () => {
        console.log(
          `WebSocket disconnected. Attempting to reconnect in 3 seconds...`
        );
        // Clear any existing timeout
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
        }
        if (heartbeatIntervalRef.current) {
          clearInterval(heartbeatIntervalRef.current);
        }
        // Attempt to reconnect after a delay
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };
    };

    connect();

    return () => {
      // Clean up on component unmount or symbol change
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol, onPriceUpdate]);

  return null; // This component doesn't render anything
}
