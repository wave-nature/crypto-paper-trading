import { User, SettingsIcon, FileText, TrendingUp, DollarSign } from "lucide-react";
import { SymbolsUpperCase } from "@/types";
import { POSITIONS, PROFILE, PNL_ANALYTICS, SETTINGS, PRICING } from "./navigation";

export const CRYPTOCURRENCIES: SymbolsUpperCase[] = [
  "BTC",
  "ETH",
  "SOL",
  "XAUUSD",
];

export const ORIGINAL_SORTED_ARR = [40, 30, 20, 10];

export const SIDEBAR_ITEMS = [
  { icon: User, label: "Profile", href: PROFILE },
  { icon: TrendingUp, label: "Positions", href: POSITIONS },
  { icon: DollarSign, label: "Pricing", href: PRICING },
  { icon: FileText, label: "PNL Analytics", href: PNL_ANALYTICS },
  // { icon: Bot, label: "Trading Bot", href: "/trading-bot" },
  { icon: SettingsIcon, label: "Settings", href: SETTINGS },
];
