"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { AUTH_LOGIN, AUTH_SIGNUP, DASHBOARD } from "@/constants/navigation";
import useAuthStore from "@/store/useAuthStore";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "#" },
    { name: "Pricing", href: "#pricing" },
    { name: "Blogs", href: "#blogs" },
  ];

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        scrolled
          ? "bg-background/80 backdrop-blur-md border-border/40 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-2xl font-bold text-primary">
              Paprweight
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md text-sm font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link
                href={DASHBOARD}
                className="bg-violet-500 text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-primary/25"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href={AUTH_LOGIN}
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Login
                </Link>
                <Link
                  href={AUTH_SIGNUP}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg hover:shadow-primary/25"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-primary hover:bg-accent focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md border-b border-border">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-muted-foreground hover:text-primary block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 pb-2 border-t border-border mt-4">
              <Link
                href={AUTH_LOGIN}
                className="block px-3 py-2 text-base font-medium text-muted-foreground hover:text-primary"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href={AUTH_SIGNUP}
                className="block px-3 py-2 text-base font-medium text-primary hover:bg-accent rounded-md mt-1"
                onClick={() => setIsOpen(false)}
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
