"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-violet-500/5 via-background to-background" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Start for free, upgrade when you're ready. No hidden fees.
          </p>

          {/* Toggle */}
          <div className="flex items-center justify-center space-x-4">
            <span className={cn("text-sm font-medium transition-colors", !isAnnual ? "text-foreground" : "text-muted-foreground")}>
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
            <span className={cn("text-sm font-medium transition-colors", isAnnual ? "text-foreground" : "text-muted-foreground")}>
              Yearly <span className="text-violet-600 font-bold ml-1">(2 months free)</span>
            </span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Basic Plan */}
          <div className="relative rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col">
            <div className="mb-4">
              <h3 className="text-xl font-bold text-foreground">Basic</h3>
              <p className="text-sm text-muted-foreground">Essential features for beginners</p>
            </div>
            <div className="mb-6">
              <span className="text-4xl font-bold text-foreground">Free</span>
            </div>
            <ul className="space-y-4 mb-8 flex-1">
              {[
                "Real-time market data",
                "Basic charting tools",
                "Portfolio tracking",
                "Community access",
                "5 active paper trades"
              ].map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register"
              className="block w-full rounded-lg bg-accent text-accent-foreground py-3 px-4 text-center text-sm font-semibold hover:bg-accent/80 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="rounded-2xl border border-violet-500/30 bg-card p-6 shadow-md flex flex-col relative overflow-hidden">
             <div className="mb-4">
              <h3 className="text-xl font-bold text-foreground">Pro</h3>
              <p className="text-sm text-muted-foreground">Advanced tools for serious traders</p>
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
                "Ad-free experience"
              ].map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="h-5 w-5 text-violet-500 mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register?plan=pro"
              className="block w-full rounded-lg bg-violet-600 text-white py-3 px-4 text-center text-sm font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/25"
            >
              Start Free Pro Trial
            </Link>
          </div>

           {/* Advanced Plan */}
           <div className="relative rounded-2xl border border-indigo-500/50 bg-card p-6 shadow-xl flex flex-col relative overflow-hidden transform md:-translate-y-4">
            <div className="absolute top-0 right-0 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              BEST VALUE
            </div>
            <div className="mb-4">
              <h3 className="text-xl font-bold text-foreground">Advanced</h3>
              <p className="text-sm text-muted-foreground">For professional day traders</p>
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
                "Early access to new features"
              ].map((feature) => (
                <li key={feature} className="flex items-start">
                  <Check className="h-5 w-5 text-indigo-500 mr-2 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/register?plan=advanced"
              className="block w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 text-white py-3 px-4 text-center text-sm font-semibold hover:from-violet-700 hover:to-indigo-700 transition-all shadow-lg shadow-indigo-500/25"
            >
              Get Advanced
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
