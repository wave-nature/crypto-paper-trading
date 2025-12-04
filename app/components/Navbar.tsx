"use client";

import { useState } from "react";
import Link from "next/link";
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
  LineChart,
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
  PRICING,
  SETTINGS,
  USER_PROFILE,
} from "@/constants/navigation";
import useAuthStore from "@/store/useAuthStore";
import usePositions from "@/store/usePositions";
import { readableCurrency } from "@/utils/helpers";

export default function Navbar() {
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [addAmount, setAddAmount] = useState("");
  const supabase = createSupabaseBrowserClient();
  const { user, setBalance } = useAuthStore();
  const { overallPnl } = usePositions();

  const handleAddMoney = () => {
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

  return (
    <>
      <nav className="sticky top-0 z-50 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-violet-500/10 backdrop-blur-md border-b border-violet-500/20 shadow-sm">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-14">
            {/* Left section - Logo */}
            <Link
              href={DASHBOARD}
              className="flex items-center space-x-2 group"
            >
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 p-2 rounded-lg shadow-md group-hover:shadow-lg transition-shadow">
                <LineChart className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                Paper Trading
              </span>
            </Link>

            {/* Middle section - Navigation */}
            <div className="flex items-center space-x-6 ml-8">
              <Link
                href={DASHBOARD}
                className="flex items-center space-x-2 text-gray-700 hover:text-violet-600 transition-colors"
              >
                <span className="font-normal">Home</span>
              </Link>

              <Link
                href={PRICING}
                className="flex items-center space-x-2 text-gray-700 hover:text-violet-600 transition-colors"
              >
                <span className="font-normal">Pricing</span>
              </Link>
            </div>

            {/* Right section - User actions */}
            <div className="flex items-center space-x-4 ml-auto">
              {/* Balance Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center space-x-2 border-violet-300 hover:bg-violet-50 hover:border-violet-400 transition-colors"
                  >
                    <Wallet className="h-4 w-4 text-violet-600" />
                    <span className="font-semibold text-violet-700">
                      {readableCurrency(user?.balance || 0)}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem
                    onClick={() => setShowBalanceModal(true)}
                    className="cursor-pointer"
                  >
                    <Plus className="h-4 w-4 mr-2 text-violet-600" />
                    Add Money
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Current P/L */}
              <div
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg ${
                  overallPnl >= 0
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {overallPnl >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="font-semibold text-sm">
                  {readableCurrency(Math.abs(overallPnl)) || "0.00"}
                </span>
              </div>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full border-violet-300 hover:bg-violet-50 hover:border-violet-400"
                  >
                    <User className="h-4 w-4 text-violet-600" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={USER_PROFILE} className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href={SETTINGS} className="flex items-center">
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2 border-red-300 text-red-600 hover:bg-red-50 hover:border-red-400 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="font-normal">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Add Money Modal */}
      {showBalanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md border border-violet-200">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Add Money
            </h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="amount" className="text-gray-700">
                  Amount ($)
                </Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={addAmount}
                  onChange={(e) => setAddAmount(e.target.value)}
                  className="mt-1 border-violet-300 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>
              <div className="flex space-x-3">
                <Button
                  onClick={handleAddMoney}
                  className="flex-1 bg-violet-500 hover:bg-violet-600 text-white"
                >
                  Add Money
                </Button>
                <Button
                  onClick={() => {
                    setShowBalanceModal(false);
                    setAddAmount("");
                  }}
                  variant="outline"
                  className="flex-1 border-gray-300"
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
