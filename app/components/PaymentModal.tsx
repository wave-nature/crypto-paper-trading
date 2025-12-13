"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Lock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price: string;
    period: string;
    features?: string[];
  };
}

export default function PaymentModal({
  isOpen,
  onClose,
  plan,
}: PaymentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-border bg-card">
        {/* Header with Plan Info */}
        <div className="bg-violet-50 dark:bg-violet-900/20 p-6 border-b border-border">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              Upgrade to {plan.name}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-1.5">
              Unlock advanced trading features instantly.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex items-baseline">
            <span className="text-3xl font-bold text-violet-600 dark:text-violet-400">
              ${plan.price}
            </span>
            <span className="text-sm text-muted-foreground ml-1">
              /{plan.period === "yearly" ? "month (billed yearly)" : "month"}
            </span>
          </div>
        </div>

        <div className="p-6">
          {/* Order Summary */}
          <div className="space-y-4 mb-8">
            <h4 className="text-sm font-medium text-foreground">
              What's included:
            </h4>
            <ul className="space-y-3">
              {[
                "Instant access to all features",
                "Secure encrypted payment",
                "14-day money-back guarantee",
              ].map((item) => (
                <li key={item} className="flex items-start text-sm">
                  <Check className="h-4 w-4 text-green-500 mr-2.5 mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment Button - PayPal Simulation */}
          <div className="space-y-4">
            <Button
              className="w-full bg-[#0070BA] hover:bg-[#005ea6] text-white font-bold py-6 text-base shadow-md transition-all relative overflow-hidden group"
              onClick={onClose}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2">
                <span className="italic font-bold font-serif text-lg">
                  Pay<span className="text-[#003087]">Pal</span>
                </span>
                <span className="font-sans font-medium text-sm ml-1 opacity-90">
                  Checkout
                </span>
              </div>
            </Button>

            <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1.5">
              <Lock className="h-3 w-3" />
              Payments are secure and encrypted
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/50 p-4 border-t border-border flex justify-center">
          <div className="flex items-center gap-2 text-xs text-muted-foreground grayscale opacity-70">
            <ShieldCheck className="h-4 w-4" />
            <span>Powered by Secure Payment Gateway</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
