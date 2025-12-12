"use client";

import { useState } from "react";
import { X, Plus, Bitcoin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { SymbolsUpperCase } from "@/types";
import { cn } from "@/lib/utils";
import { CRYPTOCURRENCIES } from "@/constants";

interface CryptoTabsProps {
  activeTabs: SymbolsUpperCase[];
  selectedTab: SymbolsUpperCase | "";
  onSelect: (tab: SymbolsUpperCase) => void;
  onClose: (tab: SymbolsUpperCase) => void;
  onAdd: (tab: SymbolsUpperCase) => void;
  orientation?: "horizontal" | "vertical";
}

export default function CryptoTabs({
  activeTabs,
  selectedTab,
  onSelect,
  onClose,
  onAdd,
  orientation = "horizontal",
}: CryptoTabsProps) {
  const [open, setOpen] = useState(false);

  const availableCryptos = CRYPTOCURRENCIES.filter(
    (crypto) => !activeTabs.includes(crypto)
  );

  return (
    <div
      className={cn(
        "flex gap-2",
        orientation === "vertical"
          ? "flex-col w-8 items-center"
          : "flex-row items-center"
      )}
    >
      {activeTabs.map((crypto) => (
        <div
          key={crypto}
          className={cn(
            "group relative flex items-center justify-center cursor-pointer transition-all",
            orientation === "vertical"
              ? "w-8 h-10 rounded-lg hover:bg-violet-100 dark:hover:bg-violet-900/50"
              : "px-3 py-1.5 rounded-full border hover:bg-violet-50 dark:hover:bg-violet-900/20",
            selectedTab === crypto
              ? orientation === "vertical"
                ? "bg-violet-100 text-violet-600 dark:bg-violet-900/50 dark:text-violet-300 ring-2 ring-violet-500 ring-offset-2 ring-offset-background"
                : "bg-violet-500 text-white border-violet-500 hover:bg-violet-600 shadow-md"
              : "text-muted-foreground border-transparent bg-background"
          )}
          onClick={() => onSelect(crypto)}
          title={crypto}
        >
          {/* Vertical Mode: Icon or Initial */}
          {orientation === "vertical" ? (
            <span className="text-xs font-bold">{crypto.substring(0, 3)}</span>
          ) : (
            // Horizontal Mode: Full Text + Close Button
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{crypto}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClose(crypto);
                }}
                className={cn(
                  "opacity-0 group-hover:opacity-100 transition-opacity rounded-full p-0.5",
                  selectedTab === crypto
                    ? "hover:bg-violet-400 text-white"
                    : "hover:bg-gray-200 text-gray-400"
                )}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {/* Vertical Mode Close Button (Absolute) */}
          {orientation === "vertical" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(crypto);
              }}
              className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-sm z-10"
            >
              <X className="h-2 w-2" />
            </button>
          )}
        </div>
      ))}

      {/* Add Button */}
      {availableCryptos.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "rounded-full hover:bg-violet-100 text-violet-500",
                orientation === "vertical" ? "w-8 h-8" : "h-7 w-7"
              )}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-40 p-1"
            align="start"
            side={orientation === "vertical" ? "right" : "bottom"}
          >
            <div className="grid gap-1">
              {availableCryptos.map((crypto) => (
                <Button
                  key={crypto}
                  variant="ghost"
                  className="w-full justify-start text-sm h-8"
                  onClick={() => {
                    onAdd(crypto);
                    setOpen(false);
                  }}
                >
                  {crypto}
                </Button>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}
