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
  CreditCard,
  ArrowUpDown,
  Bot,
  ChevronLeft,
  Bell,
  Lock,
  Palette,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import Navbar from "@/app/components/Navbar"


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

export default function SettingsPageContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <>
      <Navbar balance={1} currentProfitLoss={1} onAddMoney={() => {}} />
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
                const isActive = item.label === "Preferences";
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
            <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Settings
            </h1>

            <div className="grid gap-6">
              <Card className="border-violet-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                  <CardTitle className="flex items-center text-violet-700 text-base">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="trade-alerts"
                      className="font-medium text-sm"
                    >
                      Trade Alerts
                    </Label>
                    <Switch id="trade-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="price-alerts"
                      className="font-medium text-sm"
                    >
                      Price Alerts
                    </Label>
                    <Switch id="price-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="email-notifications"
                      className="font-medium text-sm"
                    >
                      Email Notifications
                    </Label>
                    <Switch id="email-notifications" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-violet-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                  <CardTitle className="flex items-center text-violet-700 text-base">
                    <Lock className="h-4 w-4 mr-2" />
                    Security
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="two-factor" className="font-medium text-sm">
                      Two-Factor Authentication
                    </Label>
                    <Switch id="two-factor" />
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-violet-300 hover:bg-violet-50 text-violet-700 text-sm"
                  >
                    Change Password
                  </Button>
                </CardContent>
              </Card>

              <Card className="border-violet-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                  <CardTitle className="flex items-center text-violet-700 text-base">
                    <Palette className="h-4 w-4 mr-2" />
                    Appearance
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="dark-mode" className="font-medium text-sm">
                      Dark Mode
                    </Label>
                    <Switch id="dark-mode" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-violet-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                  <CardTitle className="flex items-center text-violet-700 text-base">
                    <Globe className="h-4 w-4 mr-2" />
                    Language & Region
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                  <div>
                    <Label className="font-medium text-sm">Language</Label>
                    <select className="w-full mt-2 p-2 border border-violet-300 rounded-md focus:ring-violet-500 focus:border-violet-500 text-sm">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                </CardContent>
              </Card>

              <Button className="w-full bg-violet-500 hover:bg-violet-600 text-white text-sm">
                Save Changes
              </Button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
