"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import useStore from "@/store";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Order } from "@/types";

interface TradingInterfaceProps {
  onTrade: (
    type: "buy" | "sell",
    amount: number,
    orderDetails: {
      orderType: "market" | "limit";
      limitPrice?: number;
      stopLoss?: number;
      target?: number;
    },
  ) => void;
  currentPrice: number | null;
  selectedCrypto: string;
  onCryptoChange: (crypto: string) => void;
  onSquareOff: (orderId: string) => void;
  orders: Order[];
  cryptocurrencies: string[];
}

export default function TradingInterfaceHorizontal({
  currentPrice,
  selectedCrypto,
  orders,
  cryptocurrencies,
  onTrade,
  onCryptoChange,
  onSquareOff,
}: TradingInterfaceProps) {
  const [amount, setAmount] = useState("");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [target, setTarget] = useState("");
  const { pnl } = useStore();

  const handleTrade = (type: "buy" | "sell") => {
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

    onTrade(type, parsedAmount, orderDetails);
    setAmount("");
    setLimitPrice("");
    setStopLoss("");
    setTarget("");
  };

  const profitLoss = pnl.toFixed(2);
  // open order
  const order = orders.find((order) => order.status === "open");

  return (
    <div className="border border-violet-500/20 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-background py-0 m-0 rounded-lg">
      <div className="px-2 w-full">
        <div className="space-y-2 flex items-center justify-between w-full">
          <div>
            <select
              value={selectedCrypto}
              onChange={(e) => onCryptoChange(e.target.value)}
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
              className="w-full p-1 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 h-8"
              placeholder="Amount ($)"
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
                  className="w-full p-1 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 h-8"
                  placeholder="Set a price for your limit order"
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
                className="w-full p-1 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 h-8"
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
                className="w-full p-1 border border-violet-200 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 h-8"
                placeholder="Target (optional)"
                step="0.01"
                min="0"
              />
            </div>
          </>
          <div>
            <p>${currentPrice ? currentPrice.toFixed(2) : "0.00"}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 mr-2">
              <span>P/L:</span>
              <span className={pnl > 0 ? "text-green-500" : "text-red-500"}>
                {`${
                  profitLoss.startsWith("-") ? "-" : "+"
                }$${profitLoss.replace("-", "")}`}
              </span>
            </div>

            {order && (
              <Button
                onClick={() => onSquareOff(order?.id || "")}
                size="icon"
                variant="outline"
                className="border-violet-500 text-violet-500 hover:bg-violet-50 p-1"
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
