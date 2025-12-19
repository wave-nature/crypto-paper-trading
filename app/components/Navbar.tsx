"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Wallet,
  User,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSupabaseBrowserClient } from "@/utils/supabase/client";
import toast from "react-hot-toast";
import {
  BALANCE_UPDATED_SUCCESSFULLY,
  LOGGING_OUT_USER,
} from "@/constants/toastMessages";
import {
  AUTH_LOGIN,
  DASHBOARD,
  POSITIONS,
  PRICING,
  SETTINGS,
  USER_PROFILE,
} from "@/constants/navigation";
import useAuthStore from "@/store/useAuthStore";
import usePositions from "@/store/usePositions";
import { readableCurrency } from "@/utils/helpers";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const pathname = usePathname();
  const supabase = createSupabaseBrowserClient();
  const { user, setBalance } = useAuthStore();
  const { overallPnl } = usePositions();

  const handleAddMoney = () => {
    return toast.error("This feature exist for paid users");
    const amount = parseFloat(addAmount);
    if (amount && amount > 0) {
      setAddAmount("");
      setShowBalanceModal(false);
      setBalance(amount);
      toast.success(BALANCE_UPDATED_SUCCESSFULLY);
    }
  };

  const handleLogout = async () => {
    toast.loading(LOGGING_OUT_USER);
    const { error } = await supabase.auth.signOut();
    toast.dismiss();

    if (error) toast.error(error.message || "Error while logging out.");
    else {
      toast.success(LOGGING_OUT_USER);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      window.location.href = AUTH_LOGIN;
    }
  };

  const navItems = [
    { label: "Home", href: DASHBOARD },
    { label: "Pricing", href: PRICING },
    { label: "Orders", href: POSITIONS },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 backdrop-blur-xl transition-all duration-300 supports-[backdrop-filter]:bg-background/50">
        <div className="absolute inset-x-0 top-0 h-full bg-violet-500 pointer-events-none" />
        <div className="mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="flex items-center h-14">
            {/* Left section - Logo */}
            <Link href={"/"} className="flex items-center gap-2 group">
              <span className="text-lg font-bold text-white">
                Paprweight
              </span>
            </Link>

            {/* Middle section - Navigation */}
            <div className="flex items-center space-x-2 ml-8">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ease-out",
                      isActive
                        ? "bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 shadow-sm"
                        : "text-white hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right section - User actions */}
            <div className="flex items-center space-x-4 ml-auto">
              {/* Balance Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 h-9 px-3 border-border bg-card hover:bg-muted/80 hover:shadow-sm transition-all duration-300"
                  >
                    <Wallet className="h-3.5 w-3.5 text-violet-600 dark:text-violet-400" />
                    <span className="font-medium tabular-nums">
                      {readableCurrency(user?.balance || 0)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 animate-in fade-in-80 zoom-in-95 duration-200"
                >
                  <DropdownMenuItem
                    onClick={() => setShowBalanceModal(true)}
                    className="cursor-pointer text-violet-600 dark:text-violet-400 font-medium focus:bg-violet-50 dark:focus:bg-violet-900/10"
                  >
                    <Plus className="h-3.5 w-3.5 mr-2" />
                    Add Money
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Current P/L */}
              <div
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium border transition-colors duration-300",
                  overallPnl >= 0
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30"
                    : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30"
                )}
              >
                {overallPnl >= 0 ? (
                  <TrendingUp className="h-3.5 w-3.5 animate-pulse" />
                ) : (
                  <TrendingDown className="h-3.5 w-3.5" />
                )}
                <span className="tabular-nums">
                  {readableCurrency(Math.abs(overallPnl)) || "0.00"}
                </span>
              </div>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full h-9 w-9 border border-border bg-muted hover:bg-muted hover:scale-105 transition-all duration-300"
                  >
                    <User className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-48 animate-in slide-in-from-top-2 duration-200"
                >
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={USER_PROFILE} className="flex items-center">
                      <User className="h-4 w-4 mr-2 text-muted-foreground" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={SETTINGS} className="flex items-center">
                      <Settings className="h-4 w-4 mr-2 text-muted-foreground" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/10"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Add Money Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-card rounded-xl shadow-lg p-6 w-full max-w-md border border-border animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold mb-4 text-foreground">
              Add Money
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-muted-foreground">
                  Amount ($)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="mt-1.5 focus-visible:ring-violet-500"
                />
              </div>
              <div className="flex space-x-3 pt-2">
                <Button
                  onClick={handleAddMoney}
                  className="flex-1 bg-violet-600 hover:bg-violet-700 text-white shadow-md hover:shadow-violet-500/25 transition-all duration-300"
                >
                  Add Money
                </Button>
                <Button
                  onClick={() => {
                    setShowBalanceModal(false);
                    setAddAmount("");
                  }}
                  variant="outline"
                  className="flex-1 hover:bg-muted"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
