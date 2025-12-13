"use client";

import { SIDEBAR_ITEMS } from "@/constants";
import useSidebar from "@/store/useSidebar";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const { isSidebarOpen, setIsSidebarOpen } = useSidebar();
  const pathname = usePathname();

  return (
    <>
      <aside
        className={`${
          isSidebarOpen ? "w-64" : "w-0"
        } bg-background border-r border-border transition-all duration-300 overflow-hidden flex-shrink-0 relative`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Navigation Items */}
          <nav className="space-y-1 flex-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`group flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive
                      ? "bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer Section */}
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-medium text-muted-foreground">
                Current Plan
              </span>
              <span className="text-xs font-bold text-violet-600">Free</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Toggle Sidebar Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed left-0 top-1/2 -translate-y-1/2 bg-violet-600 text-white p-1.5 rounded-r-md shadow-md hover:bg-violet-700 transition-all z-10 focus:outline-none"
        style={{ left: isSidebarOpen ? "256px" : "0" }}
      >
        <ChevronLeft
          className={`h-4 w-4 transition-transform ${
            !isSidebarOpen ? "rotate-180" : ""
          }`}
        />
      </button>
    </>
  );
}
