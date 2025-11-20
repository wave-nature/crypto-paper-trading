"use client"

import { useState } from "react"
import { User, Mail, Phone, Settings, Shield, Key, FileText, Wallet, TrendingUp, Copy, Upload, Building, CreditCard, ArrowUpDown, Bot, ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Navbar from "@/app/components/Navbar"

const sidebarItems = [
  { icon: TrendingUp, label: "Positions", href: "/positions" },
  { icon: User, label: "Sub Accounts", href: "/sub-accounts" },
  { icon: FileText, label: "PNL Analytics", href: "/pnl-analytics" },
  { icon: Building, label: "Bank Details", href: "/bank-details" },
  { icon: Wallet, label: "Add Funds", href: "/add-funds" },
  { icon: ArrowUpDown, label: "Withdraw", href: "/withdraw" },
  { icon: Bot, label: "Trading Bot", href: "/trading-bot" },
  { icon: User, label: "Profile", href: "/profile", active: true },
  { icon: Settings, label: "Preferences", href: "/preferences" },
  { icon: Shield, label: "Security", href: "/security" },
  { icon: Key, label: "API Keys", href: "/api-keys" },
  { icon: FileText, label: "Trxn. Logs", href: "/transactions" },
]

export default function ProfilePageContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [avatarFile, setAvatarFile] = useState<string | null>(null)
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe_2024",
    phone: "+91 9876543210",
    email: "john.doe@example.com",
    uid: "68259021",
  })

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setAvatarFile(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <>
    <Navbar
            balance={1}
            onAddMoney={()=>{}}
            currentProfitLoss={1}
          />
    <div className="flex min-h-screen bg-gradient-to-br from-violet-50 via-purple-50 to-violet-100">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-white border-r border-violet-200 transition-all duration-300 overflow-hidden flex-shrink-0`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="space-y-1 flex-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  item.active
                    ? "bg-violet-100 text-violet-700 border-l-4 border-violet-500"
                    : "text-gray-600 hover:bg-violet-50 hover:text-violet-600"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
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
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Profile
          </h1>

          <Card className="border-violet-200 shadow-lg mb-6">
            <CardContent className="pt-6">
              {/* Avatar and UID Section */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-20 w-20 border-2 border-violet-500">
                      <AvatarImage src={avatarFile || undefined} />
                      <AvatarFallback className="bg-violet-100 text-violet-700 text-2xl">
                        {userData.firstName[0]}
                        {userData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-violet-500 rounded-full p-1.5 cursor-pointer hover:bg-violet-600 transition-colors"
                    >
                      <Upload className="h-4 w-4 text-white" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-600 font-medium">UID:</span>
                      <span className="font-bold text-lg">{userData.uid}</span>
                      <button
                        onClick={() => copyToClipboard(userData.uid)}
                        className="text-violet-600 hover:text-violet-700"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Renew KYC
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500">{userData.email}</p>
                  </div>
                </div>

                <Button className="bg-violet-500 hover:bg-violet-600 text-white">
                  Get Verified →
                </Button>
              </div>

              {/* User Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <Label className="text-gray-500 text-sm mb-2">
                    First Name
                  </Label>
                  <Input
                    value={userData.firstName}
                    onChange={(e) =>
                      setUserData({ ...userData, firstName: e.target.value })
                    }
                    className="border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <Label className="text-gray-500 text-sm mb-2">
                    Last Name
                  </Label>
                  <Input
                    value={userData.lastName}
                    onChange={(e) =>
                      setUserData({ ...userData, lastName: e.target.value })
                    }
                    className="border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <Label className="text-gray-500 text-sm mb-2">Username</Label>
                  <Input
                    value={userData.username}
                    onChange={(e) =>
                      setUserData({ ...userData, username: e.target.value })
                    }
                    className="border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>

                <div>
                  <Label className="text-gray-500 text-sm mb-2">
                    Phone Number
                  </Label>
                  <Input
                    value={userData.phone}
                    onChange={(e) =>
                      setUserData({ ...userData, phone: e.target.value })
                    }
                    className="border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                  />
                </div>
              </div>

              {/* Email Field (Full Width) */}
              <div className="mt-6">
                <Label className="text-gray-500 text-sm mb-2">
                  Email Address
                </Label>
                <Input
                  type="email"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  className="border-violet-200 focus:border-violet-500 focus:ring-violet-500"
                />
              </div>

              {/* Save Button */}
              <div className="mt-6 flex justify-end">
                <Button className="bg-violet-500 hover:bg-violet-600 text-white px-8">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info Card */}
          <Card className="border-violet-200 shadow-lg">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold text-violet-700 mb-4">
                Account Information
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <Badge className="bg-green-100 text-green-800 mt-1">
                    Active
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="font-semibold mt-1">January 2024</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
    </>
  )
}
