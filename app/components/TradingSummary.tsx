"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readableCurrency } from "@/utils/helpers";
import useSummaryHook from "@/hooks/useSummary";
import useAuthStore from "@/store/useAuthStore";

type TabType = "today" | "overall";

export default function TradingSummary() {
  const [activeTab, setActiveTab] = useState<TabType>("today");
  const [summary, setSummary] = useState<any>(null);
  const { user } = useAuthStore();
  const { getSummary } = useSummaryHook();
  useEffect(() => {
    if (user?.id) {
      fetchSummary(activeTab);
    }
  }, [user?.id]);

  function onTabChange(tab: TabType) {
    setActiveTab(tab);
    if (user?.id) {
      fetchSummary(tab);
    }
  }

  async function fetchSummary(tab: string) {
    if (user?.id) {
      const { data, error } = await getSummary({
        userId: user?.id,
        type: tab,
      });
      if (error) {
        console.error(error);
        return;
      }
      setSummary(data);
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
            <p className="text-2xl font-bold text-red-500">
              {readableCurrency(summary?.overallPnl || 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
