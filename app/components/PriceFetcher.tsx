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

  useEffect(() => {
    const connect = () => {
      // Use a specific endpoint for NIFTY50 if needed, otherwise default to crypto
      const endpoint = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@trade`;

      const ws = new WebSocket(endpoint);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log(`WebSocket connected to ${symbol}`);
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const price = parseFloat(data.p);
        if (!isNaN(price)) {
          onPriceUpdate(price);
        }
      };

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
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [symbol, onPriceUpdate]);

  return null; // This component doesn't render anything
}
