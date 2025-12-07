"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readableCurrency } from "@/utils/helpers";
import useSummaryHook from "@/hooks/useSummary";
import useAuthStore from "@/store/useAuthStore";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useSummary from "@/store/useSummary";

type TabType = "today" | "overall";

export default function TradingSummary() {
  const [activeTab, setActiveTab] = useState<TabType>("today");
  const { summary, loader } = useSummary();
  const { user } = useAuthStore();
  const { getSummary } = useSummaryHook();
  useEffect(() => {
    if (user?.id) {
      getSummary({ type: activeTab });
    }
  }, [user?.id]);

  function onTabChange(tab: TabType) {
    setActiveTab(tab);
    if (user?.id) {
      getSummary({ type: tab });
    }
  }

  const profitablePercentage =
    (summary?.profitableTrades / summary?.totalTrades) * 100 || 0;
  const lossPercentage =
    (summary?.lossTrades / summary?.totalTrades) * 100 || 0;

  return (
    <Card className="border-violet-500/20 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-background">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
            Trading Summary
          </CardTitle>

          {/* Tabs */}
          <div className="flex gap-2 bg-violet-100 dark:bg-violet-900/30 p-1 rounded-lg">
            <button
              onClick={() => onTabChange("today")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === "today"
                  ? "bg-violet-500 text-white shadow-sm"
                  : "text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-violet-100"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => onTabChange("overall")}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === "overall"
                  ? "bg-violet-500 text-white shadow-sm"
                  : "text-violet-700 dark:text-violet-300 hover:text-violet-900 dark:hover:text-violet-100"
              }`}
            >
              Overall
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loader ? (
          // Skeleton loader matching the exact layout
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div key={index}>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  <Skeleton width={120} height={14} />
                </h3>
                <p className="text-2xl font-bold">
                  <Skeleton width={100} height={32} />
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Profitable Trades
              </h3>
              <p className="text-2xl font-bold text-violet-600">
                {summary?.profitableTrades || 0} (
                {profitablePercentage.toFixed(2)}%)
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Loss Trades
              </h3>
              <p className="text-2xl font-bold">
                {summary?.lossTrades || 0} ({lossPercentage.toFixed(2)}%)
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Total Trades
              </h3>
              <p className="text-2xl font-bold text-violet-600">
                {summary?.totalTrades || 0}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Most Profitable Trade
              </h3>
              <p className="text-2xl font-bold text-green-500">
                {readableCurrency(summary?.mostProfitableTrade || 0)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Biggest Loss Trade
              </h3>
              <p className="text-2xl font-bold text-red-500">
                {readableCurrency(summary?.mostLossTrade || 0)}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground">
                Overall P/L
              </h3>
              <p
                className={`text-2xl font-bold ${summary?.overallPnl >= 0 ? "text-green-500" : "text-red-500"}`}
              >
                {readableCurrency(Math.abs(summary?.overallPnl || 0))}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
