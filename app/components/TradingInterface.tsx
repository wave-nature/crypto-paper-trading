"use client";

import { useState, } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Switch } from "@/components/ui/switch";
import { useCurrentPrices } from "@/store/usePositions";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
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
    },
  ) => void;
  selectedCrypto: SymbolsUpperCase | "";
  onCryptoChange: (crypto: SymbolsUpperCase | "") => void;
  onSquareOff: (orderId: string) => void;
  onScreenshotToggle: (enable: boolean) => void;
  orders: Order[];
  cryptocurrencies: string[];
}

export default function TradingInterface({
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
    <Card className="h-full border-violet-500/20 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-background">
      <div className="p-4 pb-2">
        <CardTitle className="bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
          Place Order
        </CardTitle>

        {/* Screenshot Toggle */}
        <div className="flex items-center gap-2 mt-3 p-2 bg-violet-50 dark:bg-violet-950/30 rounded-lg border border-violet-200 dark:border-violet-800">
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 flex-1">
            Enable Screenshot
          </span>
          <Switch
            checked={settings.enableScreenshot}
            onCheckedChange={handleScreenshotToggle}
            className="data-[state=checked]:bg-amber-500"
          />
        </div>
      </div>

      <CardContent className="p-4 pt-0">
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Cryptocurrency:</label>
            <select
              value={selectedCrypto}
              onChange={(e) => {
                const crypto = e.target.value as SymbolsUpperCase;
                onCryptoChange(crypto);
                localStorage.setItem("selectedCrypto", crypto);
              }}
              className="w-full p-2 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
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
            className="w-full grid grid-cols-2"
          >
            <ToggleGroupItem
              value="market"
              aria-label="Select market order"
              className="data-[state=on]:bg-violet-500 data-[state=on]:text-white"
            >
              Market
            </ToggleGroupItem>
            <ToggleGroupItem
              value="limit"
              aria-label="Select limit order"
              className="data-[state=on]:bg-violet-500 data-[state=on]:text-white"
            >
              Limit
            </ToggleGroupItem>
          </ToggleGroup>
          <div>
            <label className="block mb-1">Quantity ({selectedCrypto}):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
              placeholder="e.g., 0.1"
              step="0.0001"
              min="0"
            />
          </div>
          <>
            {orderType === "limit" && (
              <div>
                <label className="block mb-1">Buy Price:</label>
                <input
                  type="number"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  className="w-full p-2 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                  placeholder="Set a price for your limit order"
                  step="0.01"
                  min="0"
                />
              </div>
            )}
            <div>
              <label className="block mb-1">Stop Loss (optional):</label>
              <input
                type="number"
                value={stopLoss}
                onChange={(e) => setStopLoss(e.target.value)}
                className="w-full p-2 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="e.g., 45000"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block mb-1">Target (optional):</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full p-2 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="e.g., 55000"
                step="0.01"
                min="0"
              />
            </div>
          </>
          <div>
            <p className="mb-2">
              Current Price:{" "}
              {currentPrice ? readableCurrency(currentPrice) : "Loading..."}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span>P/L:</span>
              <span
                className={profitLoss >= 0 ? "text-green-500" : "text-red-500"}
              >
                {readableCurrency(profitLoss)}
              </span>
            </div>

            <div className="flex space-x-2">
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
                  className="border-violet-500 text-violet-500 hover:bg-violet-50"
                >
                  <X className="h-2 w-2" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => handleTrade("buy")}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
            >
              Buy
            </button>
            <button
              onClick={() => handleTrade("sell")}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Sell
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
