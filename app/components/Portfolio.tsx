"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import useAuthStore from "@/store/useAuthStore";
import { readableCurrency } from "@/utils/helpers";
import toast from "react-hot-toast";
import { Wallet, Plus } from "lucide-react";

interface PortfolioProps {
  balance: number;
}

export default function Portfolio({ balance }: PortfolioProps) {
  const [addAmount, setAddAmount] = useState("");
  const { setBalance } = useAuthStore();

  const handleAddMoney = () => {
    return toast.error("This feature exist for paid users");
    const amount = Number.parseFloat(addAmount);
    if (!isNaN(amount) && amount > 0) {
      setBalance(amount);
      setAddAmount("");
    } else {
      alert("Please enter a valid amount");
    }
  };

  return (
    <Card className="border-border bg-card shadow-sm h-full rounded-xl">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold tracking-tight flex items-center gap-2">
          <Wallet className="h-5 w-5 text-violet-600" />
          Portfolio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 rounded-xl bg-violet-50 dark:bg-violet-900/10 border border-violet-100 dark:border-violet-900/20">
          <span className="text-sm font-medium text-muted-foreground block mb-1">
            Cash Balance
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold tracking-tight text-foreground">
              {readableCurrency(balance || 0)}
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              USD
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <span className="text-sm font-medium text-foreground flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Add Funds
          </span>
          <div className="flex gap-2">
            <Input
              type="number"
              value={addAmount}
              onChange={(e) => setAddAmount(e.target.value)}
              placeholder="Enter amount"
              className="focus-visible:ring-violet-500 h-10"
            />
            <Button
              onClick={handleAddMoney}
              className="bg-violet-600 hover:bg-violet-700 text-white shrink-0"
            >
              Add Money
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground px-1">
            * Deposits are simulated for paper trading.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
