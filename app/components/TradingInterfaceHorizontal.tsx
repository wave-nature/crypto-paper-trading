"use client";

import { useState } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useStore, { useCurrentPrices } from "@/store/usePositions";
import { Button } from "@/components/ui/button";
import { X, Camera } from "lucide-react";
import { Order, Symbols, SymbolsUpperCase } from "@/types";
import { readableCurrency } from "@/utils/helpers";
import toast from "react-hot-toast";
import useSettings from "@/store/useSettings";
import { Switch } from "@/components/ui/switch";

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
    },
  ) => void;
  selectedCrypto: SymbolsUpperCase | "";
  onCryptoChange: (crypto: SymbolsUpperCase | "") => void;
  onSquareOff: (orderId: string) => void;
  onScreenshotToggle: (enable: boolean) => void;
  orders: Order[];
  cryptocurrencies: string[];
}

export default function TradingInterfaceHorizontal({
  selectedCrypto,
  orders,
  cryptocurrencies,
  onTrade,
  onCryptoChange,
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
    (order) => order.status === "open" && order.symbol === selectedCrypto,
  );

  return (
    <div className="border border-violet-500/20 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-background py-0 m-0 rounded-lg">
      <div className="px-[3px] w-full">
        <div className="my-[3px] flex items-center justify-between w-full">
          <div>
            <select
              value={selectedCrypto}
              onChange={(e) => {
                const crypto = e.target.value as SymbolsUpperCase;
                onCryptoChange(crypto);
                localStorage.setItem("selectedCrypto", crypto);
              }}
              className="w-full p-1 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
            >
              {cryptocurrencies.map((crypto) => (
                <option key={crypto} value={crypto}>
                  {crypto}
                </option>
              ))}
            </select>
          </div>
          <ToggleGroup
            type="single"
            value={orderType}
            onValueChange={(value: "market" | "limit") => {
              if (value) setOrderType(value);
            }}
            className="flex m-0"
          >
            <ToggleGroupItem
              value="market"
              aria-label="Select market order"
              className="data-[state=on]:bg-violet-500 data-[state=on]:text-white px-2 py-1 h-8 m-0"
            >
              Market
            </ToggleGroupItem>
            <ToggleGroupItem
              value="limit"
              aria-label="Select limit order"
              className="data-[state=on]:bg-violet-500 data-[state=on]:text-white px-2 py-1 h-8 m-0"
            >
              Limit
            </ToggleGroupItem>
          </ToggleGroup>
          <div>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-[85%] p-1 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 h-8 placeholder:text-sm"
              placeholder="Quantity"
              step="0.0001"
              min="0"
            />
          </div>
          <>
            {orderType === "limit" && (
              <div>
                <input
                  type="number"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-[85%] p-1 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 h-8 placeholder:text-sm"
                  placeholder="Limit Price ($)"
                  step="0.01"
                  min="0"
                />
              </div>
            )}
            <div>
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-[85%] p-1 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 h-8 placeholder:text-sm"
                placeholder="Stop Loss (optional)"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-[85%] p-1 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 h-8 placeholder:text-sm"
                placeholder="Target (optional)"
                step="0.01"
                min="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <Camera className="h-6 w-6" />
              <Switch
                checked={settings.enableScreenshot}
                onCheckedChange={handleScreenshotToggle}
                className="data-[state=checked]:bg-amber-500 h-4 w-10"
              />
            </div>
          </>
          <div>
            <p>{currentPrice ? readableCurrency(currentPrice) : "0.00"}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mr-2">
              <span>P/L:</span>
              <span
                className={profitLoss >= 0 ? "text-green-500" : "text-red-500"}
              >
                {readableCurrency(profitLoss)}
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
                      onSquareOff(order.id),
                  );
                }}
                size="icon"
                variant="outline"
                className="border-red-500 text-red-500 hover:bg-violet-50 p-0 h-8 w-8"
              >
                <X />
              </Button>
            )}
          </div>

          <div className="flex justify-between items-center gap-3">
            <button
              onClick={() => handleTrade("buy")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-1 rounded transition-colors"
            >
              Buy
            </button>
            <button
              onClick={() => handleTrade("sell")}
              className="bg-red-500 text-white px-4 py-1 rounded"
            >
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
