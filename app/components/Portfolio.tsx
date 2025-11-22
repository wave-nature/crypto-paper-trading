"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/useAuthStore";

interface PortfolioProps {
  balance: number;
}

export default function Portfolio({ balance }: PortfolioProps) {
  const [addAmount, setAddAmount] = useState("");
  const { setBalance } = useAuthStore();

  const handleAddMoney = () => {
    const amount = Number.parseFloat(addAmount);
    if (!isNaN(amount) && amount > 0) {
      setBalance(amount);
      setAddAmount("");
    } else {
      alert("Please enter a valid amount");
    }
  };

  return (
    <Card className="border-violet-500/20 bg-gradient-to-br from-violet-50/50 to-white dark:from-violet-950/20 dark:to-background">
      <CardHeader>
        <CardTitle className="bg-gradient-to-r from-violet-600 to-violet-400 bg-clip-text text-transparent">
          Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 h-full flex flex-col justify-between">
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold">Cash Balance</h3>
            <p className="text-2xl font-bold text-violet-600">
              ${balance.toFixed(2)}
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Add Money</h3>
            <div className="flex space-x-2">
              <Input
                type="number"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                placeholder="Amount to add"
                className="focus-visible:ring-violet-500"
              />
              <Button
                onClick={handleAddMoney}
                className="bg-violet-500 hover:bg-violet-600"
              >
                Add
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
