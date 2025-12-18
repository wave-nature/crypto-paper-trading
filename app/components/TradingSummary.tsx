"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readableCurrency } from "@/utils/helpers";
import useSummaryHook from "@/hooks/useSummary";
import useAuthStore from "@/store/useAuthStore";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import useSummary from "@/store/useSummary";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  Target,
  Activity,
  BarChart2,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

  function onTabChange(value: string) {
    const tab = value as TabType;
    setActiveTab(tab);
    if (user?.id) {
      getSummary({ type: tab });
    }
  }

  const profitablePercentage =
    (summary?.profitableTrades / summary?.totalTrades) * 100 || 0;
  const lossPercentage =
    (summary?.lossTrades / summary?.totalTrades) * 100 || 0;

  const StatCard = ({
    label,
    value,
    subtext,
    icon: Icon,
    valueClassName,
  }: any) => (
    <div className="flex flex-col p-4 rounded-xl bg-muted/40 border border-border/50 hover:bg-muted/60 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        {Icon && <Icon className="h-4 w-4 text-muted-foreground/70" />}
      </div>
      <div className="mt-auto">
        <div
          className={cn("text-2xl font-bold tracking-tight", valueClassName)}
        >
          {value}
        </div>
        {subtext && (
          <p className="text-xs text-muted-foreground mt-1">{subtext}</p>
        )}
      </div>
    </div>
  );

  return (
    <Card className="border-border bg-card shadow-sm h-full rounded-xl">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Activity className="h-5 w-5 text-violet-600" />
            Trading Summary
          </CardTitle>

          <Tabs
            value={activeTab}
            onValueChange={onTabChange}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2 sm:w-[200px] bg-violet-100/50 dark:bg-violet-900/20">
              <TabsTrigger
                value="today"
                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white hover:text-violet-700 dark:hover:text-violet-300"
              >
                Today
              </TabsTrigger>
              <TabsTrigger
                value="overall"
                className="data-[state=active]:bg-violet-600 data-[state=active]:text-white hover:text-violet-700 dark:hover:text-violet-300"
              >
                Overall
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent>
        {loader ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-muted/20 border border-border/40 h-[100px] flex flex-col justify-end"
              >
                <Skeleton width="40%" height={16} className="mb-2" />
                <Skeleton width="80%" height={32} />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Total Trades - Neutral */}
            <StatCard
              label="Total Trades"
              value={summary?.totalTrades || 0}
              icon={BarChart2}
              valueClassName="text-foreground"
            />

            {/* Profitable Trades - Green */}
            <StatCard
              label="Profitable Trades"
              value={summary?.profitableTrades || 0}
              subtext={`${profitablePercentage.toFixed(1)}% Win Rate`}
              icon={TrendingUp}
              valueClassName="text-emerald-600 dark:text-emerald-500"
            />

            {/* Loss Trades - Red */}
            <StatCard
              label="Loss Trades"
              value={summary?.lossTrades || 0}
              subtext={`${lossPercentage.toFixed(1)}% Loss Rate`}
              icon={TrendingDown}
              valueClassName="text-rose-600 dark:text-rose-500"
            />

            {/* Overall P/L - Dynamic */}
            <StatCard
              label="Overall P/L"
              value={readableCurrency(Math.abs(summary?.overallPnl || 0))}
              icon={DollarSign}
              valueClassName={
                summary?.overallPnl >= 0
                  ? "text-emerald-600 dark:text-emerald-500"
                  : "text-rose-600 dark:text-rose-500"
              }
              subtext={summary?.overallPnl >= 0 ? "Net Profit" : "Net Loss"}
            />

            {/* Best Trade */}
            <StatCard
              label="Best Trade"
              value={readableCurrency(summary?.mostProfitableTrade || 0)}
              icon={Target}
              valueClassName="text-emerald-600 dark:text-emerald-500"
            />

            {/* Worst Trade */}
            <StatCard
              label="Worst Trade"
              value={readableCurrency(summary?.mostLossTrade || 0)}
              icon={TrendingDown}
              valueClassName="text-rose-600 dark:text-rose-500"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
