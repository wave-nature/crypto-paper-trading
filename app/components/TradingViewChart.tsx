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
        new window.TradingView.widget({
          autosize: true,
          symbol: `BINANCE:${symbol}USDT`,
          interval: "5", // Set default time to 5 minutes
          timezone: "Etc/UTC",
          theme: "light",
          style: "1",
          locale: "en",
          toolbar_bg: "#f1f3f6",
          enable_publishing: false,
          allow_symbol_change: true,
          container_id: containerRef.current.id,
          hide_side_toolbar: false, // Show left toolbar for drawings
          withdateranges: true,
          drawings_access: {
            type: "black", // Allows drawing on the chart
            tools: [
              { name: "Trend Line" },
              { name: "Rectangle" },
              { name: "Fib Retracement" },
              { name: "Brush" },
              { name: "Horizontal Line" },
            ],
          },
          overrides: {
            "mainSeriesProperties.style": 1, // Candlestick chart
            "paneProperties.background": "#ffffff",
            "paneProperties.vertGridProperties.color": "#E6E6E6",
            "paneProperties.horzGridProperties.color": "#E6E6E6",
          },
        });
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
      className="w-full h-[90vh]"
    />
  );
}
