"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useStore, { useCurrentPrices } from "@/store/usePositions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Camera, TrendingUp, TrendingDown } from "lucide-react";
import { Order, Symbols, SymbolsUpperCase } from "@/types";
import { readableCurrency } from "@/utils/helpers";
import toast from "react-hot-toast";
import useSettings from "@/store/useSettings";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

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

export default function TradingInterfaceHorizontal({
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
  const { selectedCryptoPnl } = useStore();
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
    <div className="border border-border bg-card shadow-sm px-3 rounded-xl flex items-center gap-3 py-1 w-full">
      {/* Order Type Toggle */}
      <ToggleGroup
        type="single"
        value={orderType}
        onValueChange={(value: "market" | "limit") => {
          if (value) setOrderType(value);
        }}
        className="flex gap-1 shrink-0"
      >
        <ToggleGroupItem
          value="market"
          aria-label="Select market order"
          className="data-[state=on]:bg-violet-600 data-[state=on]:text-white h-6 text-xs px-2.5 rounded-lg transition-colors border-transparent hover:bg-muted"
        >
          Market
        </ToggleGroupItem>
        <ToggleGroupItem
          value="limit"
          aria-label="Select limit order"
          className="data-[state=on]:bg-violet-600 data-[state=on]:text-white h-6 text-xs px-2.5 rounded-lg transition-colors border-transparent hover:bg-muted"
        >
          Limit
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="h-4 w-px bg-border/60 mx-1 mobile-hidden" />

      {/* Inputs */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-6 text-xs w-24 focus-visible:ring-violet-500"
          placeholder="Qty"
          step="0.0001"
          min="0"
        />

        {orderType === "limit" && (
          <Input
            type="number"
            value={limitPrice}
            onChange={(e) => setLimitPrice(e.target.value)}
            className="h-6 text-xs w-24 focus-visible:ring-violet-500"
            placeholder="Price"
            step="0.01"
            min="0"
          />
        )}

        <Input
          type="number"
          value={stopLoss}
          onChange={(e) => setStopLoss(e.target.value)}
          className="h-6 text-xs w-24 focus-visible:ring-violet-500"
          placeholder="SL"
          step="0.01"
          min="0"
        />
        <Input
          type="number"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className="h-6 text-xs w-24 focus-visible:ring-violet-500"
          placeholder="Target"
          step="0.01"
          min="0"
        />
      </div>

      {/* Tools and Info */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Screenshot */}
        <div className="flex items-center gap-1.5" title="Toggle Screenshot">
          <Camera className="h-4 w-4 text-muted-foreground" />
          <Switch
            checked={settings.enableScreenshot}
            onCheckedChange={handleScreenshotToggle}
            className="data-[state=checked]:bg-violet-600 scale-75 origin-left"
          />
        </div>

        {/* Price Info */}
        <div className="flex flex-col items-end leading-tight">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">
            Current
          </span>
          <span className="text-xs font-bold tabular-nums">
            {currentPrice ? readableCurrency(currentPrice) : "0.00"}
          </span>
        </div>

        {/* P/L Info */}
        <div className="flex flex-col items-end leading-tight min-w-[60px]">
          <span className="text-[10px] uppercase font-bold text-muted-foreground">
            P/L
          </span>
          <span
            className={cn(
              "text-xs font-bold tabular-nums flex items-center gap-0.5",
              profitLoss >= 0 ? "text-emerald-600" : "text-rose-600"
            )}
          >
            {readableCurrency(Math.abs(profitLoss))}
            {profitLoss > 0 && <TrendingUp className="h-2.5 w-2.5" />}
            {profitLoss < 0 && <TrendingDown className="h-2.5 w-2.5" />}
          </span>
        </div>
        {order && (
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
            className="h-7 w-7 text-muted-foreground hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-900/20 rounded-full"
            title="Square Off"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="h-6 w-px bg-border/60 mx-1" />

      {/* Actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          onClick={() => handleTrade("buy")}
          size="sm"
          className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm h-6 px-4 text-xs font-semibold"
        >
          Buy
        </Button>
        <Button
          onClick={() => handleTrade("sell")}
          size="sm"
          className="bg-rose-600 hover:bg-rose-700 text-white shadow-sm h-6 px-4 text-xs font-semibold"
        >
          Sell
        </Button>
      </div>
    </div>
  );
}
