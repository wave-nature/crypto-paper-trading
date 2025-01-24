"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TradingInterfaceProps {
  onTrade: (type: "buy" | "sell", amount: number) => void
  currentPrice: number | null
  selectedCrypto: string
  onCryptoChange: (crypto: string) => void
  cryptocurrencies: string[]
}

export default function TradingInterface({
  onTrade,
  currentPrice,
  selectedCrypto,
  onCryptoChange,
  cryptocurrencies,
}: TradingInterfaceProps) {
  const [amount, setAmount] = useState("")

  const handleTrade = (type: "buy" | "sell") => {
    const parsedAmount = Number.parseFloat(amount)
    if (!isNaN(parsedAmount) && parsedAmount > 0) {
      onTrade(type, parsedAmount)
      setAmount("")
    } else {
      alert("Please enter a valid amount")
    }
  }

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
          <div>
            <label className="block mb-1">Amount ({selectedCrypto}):</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              step="0.0001"
              min="0"
            />
          </div>
          <div>
            <p className="mb-2">Current Price: ${currentPrice ? currentPrice.toFixed(2) : "Loading..."}</p>
          </div>
          <div className="flex justify-between">
            <button onClick={() => handleTrade("buy")} className="bg-green-500 text-white px-4 py-2 rounded">
              Buy
            </button>
            <button onClick={() => handleTrade("sell")} className="bg-red-500 text-white px-4 py-2 rounded">
              Sell
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

