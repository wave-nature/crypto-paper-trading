"use client";

import { ChevronLeft, Bell, Lock, Palette, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Sidebar from "@/app/components/Sidebar";
import useSidebar from "@/store/useSidebar";

export default function SettingsPageContent() {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  return (
    <>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-3xl mx-auto space-y-8">
            <div className="grid gap-6">
              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-violet-600" />
                    <CardTitle>Notifications</CardTitle>
                  </div>
                  <CardDescription>
                    Choose what alerts you want to receive.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="trade-alerts"
                      className="flex flex-col space-y-1"
                    >
                      <span className="font-medium">Trade Alerts</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Receive updates when orders are executed.
                      </span>
                    </Label>
                    <Switch id="trade-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="price-alerts"
                      className="flex flex-col space-y-1"
                    >
                      <span className="font-medium">Price Alerts</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Get notified when assets reach your target price.
                      </span>
                    </Label>
                    <Switch id="price-alerts" />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="email-notifications"
                      className="flex flex-col space-y-1"
                    >
                      <span className="font-medium">Email Notifications</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Receive a daily summary of your portfolio.
                      </span>
                    </Label>
                    <Switch id="email-notifications" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-violet-600" />
                    <CardTitle>Security</CardTitle>
                  </div>
                  <CardDescription>
                    Protect your account with additional security features.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="two-factor"
                      className="flex flex-col space-y-1"
                    >
                      <span className="font-medium">
                        Two-Factor Authentication
                      </span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Add an extra layer of security to your account.
                      </span>
                    </Label>
                    <Switch id="two-factor" />
                  </div>
                  <div className="pt-2">
                    <Button variant="outline">Change Password</Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette className="h-5 w-5 text-violet-600" />
                    <CardTitle>Appearance</CardTitle>
                  </div>
                  <CardDescription>
                    Customize the look and feel of the dashboard.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="dark-mode"
                      className="flex flex-col space-y-1"
                    >
                      <span className="font-medium">Dark Mode</span>
                      <span className="font-normal text-sm text-muted-foreground">
                        Switch between light and dark themes.
                      </span>
                    </Label>
                    <Switch id="dark-mode" />
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-violet-600" />
                    <CardTitle>Language & Region</CardTitle>
                  </div>
                  <CardDescription>
                    Set your preferred language and regional settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select defaultValue="english">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end pt-4">
                <Button className="px-8 bg-violet-600 hover:bg-violet-700 text-white">
                  Save Preferences
                </Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
