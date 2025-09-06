"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface TradingInterfaceProps {
  onTrade: (
    type: "buy" | "sell",
    amount: number,
    orderDetails: {
      orderType: "market" | "limit";
      limitPrice?: number;
      stopLoss?: number;
      target?: number;
    }
  ) => void;
  currentPrice: number | null;
  selectedCrypto: string;
  onCryptoChange: (crypto: string) => void;
  cryptocurrencies: string[];
}

export default function TradingInterface({
  onTrade,
  currentPrice,
  selectedCrypto,
  onCryptoChange,
  cryptocurrencies,
}: TradingInterfaceProps) {
  const [amount, setAmount] = useState("");
  const [orderType, setOrderType] = useState<"market" | "limit">("market");
  const [limitPrice, setLimitPrice] = useState("");
  const [stopLoss, setStopLoss] = useState("");
  const [target, setTarget] = useState("");

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

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Trading Interface</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block mb-1">Cryptocurrency:</label>
            <select
              value={selectedCrypto}
              onChange={(e) => onCryptoChange(e.target.value)}
              className="w-full p-2 border rounded"
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
            <ToggleGroupItem value="market" aria-label="Select market order">
              Market
            </ToggleGroupItem>
            <ToggleGroupItem value="limit" aria-label="Select limit order">
              Limit
            </ToggleGroupItem>
          </ToggleGroup>
          <div>
            <label className="block mb-1">Amount ({selectedCrypto}):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
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
                  className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
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
                className="w-full p-2 border rounded"
                placeholder="e.g., 55000"
                step="0.01"
                min="0"
              />
            </div>
          </>
          <div>
            <p className="mb-2">
              Current Price: $
              {currentPrice ? currentPrice.toFixed(2) : "Loading..."}
            </p>
          </div>
          <div className="flex justify-between">
            <button
              onClick={() => handleTrade("buy")}
              className="bg-green-500 text-white px-4 py-2 rounded"
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
