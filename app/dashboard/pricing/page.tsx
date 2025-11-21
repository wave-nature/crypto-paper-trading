"use client";

import { useState } from "react";
import {
  User,
  SettingsIcon,
  Shield,
  Key,
  FileText,
  Wallet,
  TrendingUp,
  Building,
  ArrowUpDown,
  Bot,
  ChevronLeft,
  Check,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";

const sidebarItems = [
  { icon: TrendingUp, label: "Positions", href: "/positions" },
  { icon: User, label: "Sub Accounts", href: "/sub-accounts" },
  { icon: FileText, label: "PNL Analytics", href: "/pnl-analytics" },
  { icon: Building, label: "Bank Details", href: "/bank-details" },
  { icon: Wallet, label: "Add Funds", href: "/add-funds" },
  { icon: ArrowUpDown, label: "Withdraw", href: "/withdraw" },
  { icon: Bot, label: "Trading Bot", href: "/trading-bot" },
  { icon: User, label: "Profile", href: "/profile" },
  { icon: SettingsIcon, label: "Preferences", href: "/preferences" },
  { icon: Shield, label: "Security", href: "/security" },
  { icon: Key, label: "API Keys", href: "/api-keys" },
  { icon: FileText, label: "Trxn. Logs", href: "/transactions" },
];

export default function PricingPageContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? "w-64" : "w-0"
          } bg-white border-r border-violet-200 transition-all duration-300 overflow-hidden flex-shrink-0`}
        >
          <div className="p-4 h-full flex flex-col">
            <div className="space-y-1 flex-1">
              {sidebarItems.map((item) => {
                const isActive = false;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-violet-100 text-violet-700 border-l-4 border-violet-500"
                        : "text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Toggle Sidebar Button */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="fixed left-0 top-1/2 -translate-y-1/2 bg-violet-500 text-white p-2 rounded-r-lg shadow-lg hover:bg-violet-600 transition-colors z-10"
          style={{ left: isSidebarOpen ? "256px" : "0" }}
        >
          <ChevronLeft
            className={`h-5 w-5 transition-transform ${
              !isSidebarOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent text-center">
              Choose Your Plan
            </h1>
            <p className="text-gray-600 text-sm text-center mb-8">
              Select the perfect plan for your trading journey
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Free Plan */}
              <Card className="border-violet-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                  <CardTitle className="text-base text-violet-700">
                    Free
                  </CardTitle>
                  <div className="mt-3">
                    <span className="text-3xl font-bold">$0</span>
                    <span className="text-gray-600 text-sm">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-2.5 mb-6">
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-violet-600 mr-2 flex-shrink-0" />
                      <span>$1,000,000 virtual balance</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-violet-600 mr-2 flex-shrink-0" />
                      <span>Basic trading features</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-violet-600 mr-2 flex-shrink-0" />
                      <span>9 cryptocurrencies</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white text-sm">
                    Current Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Pro Plan */}
              <Card className="border-violet-500 shadow-xl hover:shadow-2xl transition-shadow relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-violet-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Popular
                  </span>
                </div>
                <CardHeader className="bg-gradient-to-r from-violet-500/20 to-purple-500/20">
                  <CardTitle className="text-base text-violet-700">
                    Pro
                  </CardTitle>
                  <div className="mt-3">
                    <span className="text-3xl font-bold">$29</span>
                    <span className="text-gray-600 text-sm">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-2.5 mb-6">
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-violet-600 mr-2 flex-shrink-0" />
                      <span>$10,000,000 virtual balance</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-violet-600 mr-2 flex-shrink-0" />
                      <span>Advanced trading tools</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-violet-600 mr-2 flex-shrink-0" />
                      <span>50+ cryptocurrencies</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-violet-600 mr-2 flex-shrink-0" />
                      <span>Priority support</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-violet-600 hover:bg-violet-700 text-white text-sm">
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>

              {/* Enterprise Plan */}
              <Card className="border-violet-200 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader className="bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                  <CardTitle className="text-base text-violet-700">
                    Enterprise
                  </CardTitle>
                  <div className="mt-3">
                    <span className="text-3xl font-bold">$99</span>
                    <span className="text-gray-600 text-sm">/month</span>
                  </div>
                </CardHeader>
                <CardContent className="pt-6">
                  <ul className="space-y-2.5 mb-6">
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-violet-600 mr-2 flex-shrink-0" />
                      <span>Unlimited virtual balance</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-violet-600 mr-2 flex-shrink-0" />
                      <span>All trading features</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-violet-600 mr-2 flex-shrink-0" />
                      <span>All cryptocurrencies</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-violet-600 mr-2 flex-shrink-0" />
                      <span>24/7 dedicated support</span>
                    </li>
                    <li className="flex items-center text-sm">
                      <Check className="h-4 w-4 text-violet-600 mr-2 flex-shrink-0" />
                      <span>API access</span>
                    </li>
                  </ul>
                  <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white text-sm">
                    Contact Sales
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
