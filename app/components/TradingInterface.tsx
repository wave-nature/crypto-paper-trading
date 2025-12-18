"use client";

import { useState } from "react";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { useCurrentPrices } from "@/store/usePositions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, TrendingUp, TrendingDown, Info } from "lucide-react";
import { Order, Symbols, SymbolsUpperCase } from "@/types";
import { readableCurrency } from "@/utils/helpers";
import toast from "react-hot-toast";
import useSettings from "@/store/useSettings";

interface TradingInterfaceProps {
  onTrade: (
    type: "buy" | "sell",
    amount: number,
    symbol: SymbolsUpperCase | "",
    orderDetails: {
      orderType: "market" | "limit";
      limitPrice?: number;
      stopLoss?: number;
      target?: number;
    }
  ) => void;
  selectedCrypto: SymbolsUpperCase | "";
  onSquareOff: (orderId: string) => void;
  onScreenshotToggle: (enable: boolean) => void;
  orders: Order[];
}

export default function TradingInterface({
  selectedCrypto,
  orders,
  onTrade,
  onSquareOff,
  onScreenshotToggle,
}: TradingInterfaceProps) {
  const [amount, setAmount] = useState("");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [target, setTarget] = useState("");
  const currentPrices = useCurrentPrices();
  const { settings, setSettings } = useSettings();
  const currentPrice = selectedCrypto
    ? currentPrices[selectedCrypto.toLowerCase() as Symbols]
    : 0;

  // Handle screenshot toggle
  const handleScreenshotToggle = async (checked: boolean) => {
    setSettings({ enableScreenshot: checked });

    try {
      onScreenshotToggle(checked);
    } catch (error) {
      // Revert the toggle on error
      setSettings({ enableScreenshot: checked });
    }
  };

  const handleTrade = (type: "buy" | "sell") => {
    if (!selectedCrypto) {
      toast.error("Please select a crypto");
      return;
    }

    const parsedAmount = Number.parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const orderDetails: {
      orderType: "market" | "limit";
      limitPrice?: number;
      stopLoss?: number;
      target?: number;
    } = {
      orderType,
      stopLoss: stopLoss ? Number.parseFloat(stopLoss) : undefined,
      target: target ? Number.parseFloat(target) : undefined,
    };

    if (orderType === "limit") {
      const parsedLimitPrice = Number.parseFloat(limitPrice);
      if (isNaN(parsedLimitPrice) || parsedLimitPrice <= 0) {
        alert("Please enter a valid limit price");
        return;
      }
      orderDetails.limitPrice = parsedLimitPrice;
    }

    onTrade(type, parsedAmount, selectedCrypto!, orderDetails);
    setAmount("");
    setLimitPrice("");
    setStopLoss("");
    setTarget("");
  };

  const profitLoss = orders.reduce((total, order) => {
    if (order.status === "open" && order.symbol === selectedCrypto) {
      const price = currentPrices[selectedCrypto.toLowerCase() as Symbols];
      const diff = price - order.price;
      const orderPL = diff * order.quantity * (order.type === "buy" ? 1 : -1);
      return total + orderPL;
    }
    return total;
  }, 0);

  // open order
  const order = orders.find(
    (order) => order.status === "open" && order.symbol === selectedCrypto
  );

  return (
    <Card className="h-full border-border bg-card shadow-sm flex flex-col">
      <CardHeader className="p-4 pb-2 space-y-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold tracking-tight">
            Place Order
          </CardTitle>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded-md">
            <Info className="w-3 h-3" />
            <span>{selectedCrypto || "Select Asset"}</span>
          </div>
        </div>

        {/* Screenshot Toggle */}
        <div className="flex items-center justify-between p-2.5 bg-muted/40 rounded-lg border border-border/50">
          <span className="text-sm font-medium text-muted-foreground">
            Chart Screenshot
          </span>
          <Switch
            checked={settings.enableScreenshot}
            onCheckedChange={handleScreenshotToggle}
            className="data-[state=checked]:bg-violet-600"
          />
        </div>
      </CardHeader>

      <CardContent className="p-4 pt-0 space-y-5 flex-1 overflow-y-auto">
        <ToggleGroup
          type="single"
          value={orderType}
          onValueChange={(value: "market" | "limit") => {
            if (value) setOrderType(value);
          }}
          className="w-full grid grid-cols-2 gap-2"
        >
          <ToggleGroupItem
            value="market"
            aria-label="Select market order"
            className="data-[state=on]:bg-violet-600 text-sm data-[state=on]:text-white hover:bg-muted/80 data-[state=on]:shadow-sm"
            size="sm"
          >
            Market
          </ToggleGroupItem>
          <ToggleGroupItem
            value="limit"
            aria-label="Select limit order"
            className="data-[state=on]:bg-violet-600 text-sm data-[state=on]:text-white hover:bg-muted/80 data-[state=on]:shadow-sm"
            size="sm"
          >
            Limit
          </ToggleGroupItem>
        </ToggleGroup>
        <div className="flex flex-col gap-3 mb-4 p-4 bg-muted/50 rounded-xl border border-border/60 shadow-sm">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              Current Price
            </p>
            <p className="font-bold text-base tabular-nums text-foreground tracking-tight">
              {currentPrice ? readableCurrency(currentPrice) : "---"}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-muted-foreground">
              Quantity ({selectedCrypto})
            </Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.0001"
              min="0"
              className="font-medium"
            />
          </div>

          {orderType === "limit" && (
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Buy Price
              </Label>
              <Input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                className="font-medium"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Stop Loss
              </Label>
              <Input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                placeholder="Optional"
                step="0.01"
                min="0"
                className="font-medium"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">
                Target
              </Label>
              <Input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Optional"
                step="0.01"
                min="0"
                className="font-medium"
              />
            </div>
          </div>
        </div>

        <div className="pt-2">
          {/* P/L Row */}
          {order && (
            <div className="flex flex-col gap-3 mb-4 p-4 bg-muted/10 rounded-xl border border-border/60 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">P/L</p>
                <div
                  className={`flex items-center gap-2 font-bold text-base tabular-nums ${
                    profitLoss >= 0
                      ? "text-emerald-600 dark:text-emerald-500"
                      : "text-rose-600 dark:text-rose-500"
                  }`}
                >
                  {profitLoss >= 0 ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  {readableCurrency(Math.abs(profitLoss))}
                  <Button
                    onClick={() => {
                      orders.forEach(
                        (order) =>
                          order?.id &&
                          order.symbol === selectedCrypto &&
                          order.status === "open" &&
                          onSquareOff(order.id)
                      );
                    }}
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 ml-1 text-muted-foreground text-rose-600 bg-rose-100 rounded-full"
                    title="Square Off Position"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={() => handleTrade("buy")}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              Buy / Long
            </Button>
            <Button
              onClick={() => handleTrade("sell")}
              className="w-full bg-rose-600 hover:bg-rose-700 text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
            >
              Sell / Short
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
