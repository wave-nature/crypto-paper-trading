"use client";

import { Check, Crown, Zap, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Sidebar from "@/app/components/Sidebar";
import PaymentModal from "@/app/components/PaymentModal";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function PricingPageContent() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string;
    price: string;
    period: string;
  } | null>(null);

  // Mock subscription data
  const currentPlan = {
    name: "Free",
    expiresAt: null,
  };

  const handleUpgrade = (
    planName: string,
    monthlyPrice: number,
    annualPrice: number
  ) => {
    const price = isAnnual ? annualPrice.toString() : monthlyPrice.toString();
    setSelectedPlan({
      name: planName,
      price,
      period: isAnnual ? "yearly" : "monthly",
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex min-h-screen bg-background">
        <Sidebar />

        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Simplified Subscription Status Card */}
            <div className="mb-16 rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-violet-100 dark:bg-violet-900/30 rounded-xl flex items-center justify-center">
                    <Crown className="h-7 w-7 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Current Plan
                    </p>
                    <h3 className="text-2xl font-bold text-foreground">
                      {currentPlan.name}
                    </h3>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-8 border-l border-border pl-8">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-violet-500" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Active Trades
                      </span>
                    </div>
                    <p className="text-xl font-bold text-foreground">
                      5{" "}
                      <span className="text-sm font-normal text-muted-foreground">
                        / 5
                      </span>
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Sparkles className="h-4 w-4 text-violet-500" />
                      <span className="text-sm font-medium text-muted-foreground">
                        Features
                      </span>
                    </div>
                    <p className="text-xl font-bold text-foreground">Basic</p>
                  </div>
                </div>

                <div>
                  <Button
                    variant="outline"
                    className="border-violet-200 hover:bg-violet-50 hover:text-violet-700 dark:border-violet-800 dark:hover:bg-violet-900/30"
                  >
                    Manage Billing
                  </Button>
                </div>
              </div>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 text-foreground">
                Upgrade Your Plan
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                Choose the perfect plan for your trading journey
              </p>

              {/* Toggle */}
              <div className="flex items-center justify-center space-x-4">
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    !isAnnual ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Monthly
                </span>
                <button
                  onClick={() => setIsAnnual(!isAnnual)}
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-600 focus-visible:ring-offset-2 bg-violet-600"
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      isAnnual ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
                <span
                  className={cn(
                    "text-sm font-medium transition-colors",
                    isAnnual ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  Yearly{" "}
                  <span className="text-violet-600 font-bold ml-1">
                    (2 months free)
                  </span>
                </span>
              </div>
            </div>

            {/* Pricing Cards */}
            <div className="grid md:grid-cols-3 gap-8">
              {/* Basic Plan */}
              <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground">Basic</h3>
                  <p className="text-sm text-muted-foreground">
                    Essential features for beginners
                  </p>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-foreground">
                    Free
                  </span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    "Real-time market data",
                    "Basic charting tools",
                    "Portfolio tracking",
                    "Community access",
                    "5 active paper trades",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/80 transition-colors"
                  disabled
                >
                  Current Plan
                </Button>
              </div>

              {/* Pro Plan */}
              <div className="rounded-2xl border border-violet-500/30 bg-card p-6 shadow-md flex flex-col relative overflow-hidden">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground">Pro</h3>
                  <p className="text-sm text-muted-foreground">
                    Advanced tools for serious traders
                  </p>
                </div>
                <div className="mb-6 flex items-baseline">
                  <span className="text-4xl font-bold text-foreground">
                    ${isAnnual ? "12" : "15"}
                  </span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    "Everything in Basic",
                    "Advanced technical indicators",
                    "Unlimited active paper trades",
                    "Backtesting capabilities",
                    "Ad-free experience",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleUpgrade("Pro", 15, 12)}
                  className="w-full bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25"
                >
                  Upgrade to Pro
                </Button>
              </div>

              {/* Advanced Plan */}
              <div className="relative rounded-2xl border border-indigo-500/50 bg-card p-6 shadow-xl flex flex-col overflow-hidden transform md:-translate-y-4">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  BEST VALUE
                </div>
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-foreground">
                    Advanced
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    For professional day traders
                  </p>
                </div>
                <div className="mb-6 flex items-baseline">
                  <span className="text-4xl font-bold text-foreground">
                    ${isAnnual ? "29" : "39"}
                  </span>
                  <span className="text-muted-foreground ml-1">/month</span>
                </div>
                <ul className="space-y-4 mb-8 flex-1">
                  {[
                    "Everything in Pro",
                    "AI-powered trade signals",
                    "Priority 24/7 Support",
                    "API Access",
                    "Dedicated Account Manager",
                    "Early access to new features",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                      <span className="text-muted-foreground text-sm">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => handleUpgrade("Advanced", 39, 29)}
                  className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-lg shadow-indigo-500/25"
                >
                  Get Advanced
                </Button>
              </div>
            </div>

            <div className="mt-16 text-center">
              <p className="text-muted-foreground text-sm">
                All plans come with a{" "}
                <span className="font-semibold text-violet-600">
                  14-day free trial
                </span>
                . Cancel anytime.
              </p>
            </div>
          </div>
        </main>
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          plan={selectedPlan}
        />
      )}
    </>
  );
}
