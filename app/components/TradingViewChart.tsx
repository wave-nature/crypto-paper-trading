"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    TradingView: any;
  }
}

interface TradingViewChartProps {
  symbol: string;
}

export default function TradingViewChart({ symbol }: TradingViewChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      if (containerRef.current) {
        const widget = new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}USDT`,
          interval: "1",
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          datafeed: {
            onReady: (callback: any) => {
              setTimeout(() => callback({}));
            },
            searchSymbols: () => {},
            resolveSymbol: (
              symbolName: string,
              onSymbolResolvedCallback: any
            ) => {
              onSymbolResolvedCallback({
                name: symbolName,
                full_name: symbolName,
                description: symbolName,
                type: "crypto",
                session: "24x7",
                timezone: "Etc/UTC",
                ticker: symbolName,
                minmov: 1,
                pricescale: 100,
                has_intraday: true,
                supported_resolutions: [
                  "1",
                  "5",
                  "15",
                  "30",
                  "60",
                  "1D",
                  "1W",
                  "1M",
                ],
              });
            },
            getBars: (
              symbolInfo: any,
              resolution: any,
              from: any,
              to: any,
              onHistoryCallback: any
            ) => {
              onHistoryCallback([], { noData: true });
            },
            subscribeBars: (
              symbolInfo: any,
              resolution: any,
              onRealtimeCallback: any,
              subscriberUID: any,
              onResetCacheNeededCallback: any
            ) => {
              // Simulated price updates
              const intervalId = setInterval(() => {
                const price = Math.random() * 1000 + 30000; // Simulated price
                onRealtimeCallback({
                  time: Date.now(),
                  open: price,
                  high: price,
                  low: price,
                  close: price,
                  volume: Math.random() * 1000,
                });
              }, 1000);
              return () => clearInterval(intervalId);
            },
            unsubscribeBars: () => {},
          },
        });

        // No need for onChartReady here, as we're using a custom datafeed
      }
    };
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [symbol]);

  return (
    <div
      id="tradingview_widget"
      ref={containerRef}
      className="w-full h-[500px]"
    />
  );
}
