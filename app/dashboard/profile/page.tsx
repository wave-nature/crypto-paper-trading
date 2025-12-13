"use client";

import { useState } from "react";
import { Copy, Upload, ChevronLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Sidebar from "@/app/components/Sidebar";
import useSidebar from "@/store/useSidebar";

export default function ProfilePageContent() {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const [avatarFile, setAvatarFile] = useState<string | null>(null);
  const [userData, setUserData] = useState({
    firstName: "John",
    lastName: "Doe",
    username: "johndoe_2024",
    phone: "+91 9876543210",
    email: "john.doe@example.com",
    uid: "68259021",
  });

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarFile(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar */}
        <Sidebar />

       

        {/* Main Content */}
        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-4xl mx-auto space-y-8">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Update your photo and personal details here.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Avatar and UID Section */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-8 pb-8 border-b border-border">
                  <div className="relative group">
                    <Avatar className="h-24 w-24 border border-border">
                      <AvatarImage src={avatarFile || undefined} />
                      <AvatarFallback className="bg-muted text-muted-foreground text-2xl">
                        {userData.firstName[0]}
                        {userData.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity"
                    >
                      <Upload className="h-6 w-6 text-white" />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarUpload}
                      />
                    </label>
                  </div>

                  <div className="flex-1 text-center md:text-left space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <h3 className="text-xl font-bold text-foreground">
                        {userData.firstName} {userData.lastName}
                      </h3>
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400"
                      >
                        Verified
                      </Badge>
                    </div>

                    <div className="flex items-center justify-center md:justify-start gap-2 text-sm text-muted-foreground">
                      <span>UID: {userData.uid}</span>
                      <button
                        onClick={() => copyToClipboard(userData.uid)}
                        className="text-violet-600 hover:text-violet-700 dark:text-violet-400"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {userData.email}
                    </p>
                  </div>

                  <Button variant="outline">View Public Profile</Button>
                </div>

                {/* User Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userData.firstName}
                      onChange={(e) =>
                        setUserData({ ...userData, firstName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userData.lastName}
                      onChange={(e) =>
                        setUserData({ ...userData, lastName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={userData.username}
                      onChange={(e) =>
                        setUserData({ ...userData, username: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={userData.phone}
                      onChange={(e) =>
                        setUserData({ ...userData, phone: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userData.email}
                      onChange={(e) =>
                        setUserData({ ...userData, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                  <Button className="px-8 bg-violet-600 hover:bg-violet-700 text-white">
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Account Status Card */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Account Status
                    </p>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="font-semibold text-foreground">
                        Active
                      </span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Member Since
                    </p>
                    <p className="font-semibold text-foreground">
                      January 2024
                    </p>
                  </div>
                  <div className="p-4 rounded-lg bg-muted/50 border border-border">
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      KYC Status
                    </p>
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-violet-600" />
                      <span className="font-semibold text-foreground">
                        Verified level 2
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
