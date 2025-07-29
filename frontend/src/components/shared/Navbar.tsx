"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import darkLogo from "@/app/assets/images/sa sec logo dark.png";
import lightLogo from "@/app/assets/images/sa sec logo.png";
import { useTheme } from "next-themes";
import { ModeToggle } from "./ThemeToggler/ThemeToggler";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Tasks & Events", href: "/tasks-events" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true); // Fix hydration mismatch
  }, []);

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-sm border-neutral-200 dark:border-neutral-800"
          : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6 lg:px-0">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            {mounted && (
              <Image
                src={resolvedTheme === "dark" ? darkLogo : lightLogo}
                alt="SA SEC Logo"
                height={40}
                className="inline-block mr-2 transition duration-300"
                priority
              />
            )}
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center justify-center flex-1 space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={cn(
                  "px-3 py-2 text-sm font-medium rounded-md transition-all",
                  isActive(link.href)
                    ? "text-red-600 dark:text-red-500 bg-red-600/10 dark:bg-red-500/10"
                    : "text-neutral-700 dark:text-neutral-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-2 md:space-x-4">
            <div className="mr-2">
              <ModeToggle />
            </div>

            <div className="hidden md:flex items-center space-x-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-medium border border-red-600 text-red-600 hover:bg-red-600/10"
              >
                Login
              </Link>
              <Link
                href="/join-us"
                className="rounded-full px-4 py-2 text-sm font-medium text-white bg-red-600 shadow hover:bg-red-700 transition"
              >
                Join Us
              </Link>
            </div>

            {/* Mobile toggle */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                aria-label="Toggle mobile menu"
                className="p-2 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
                ) : (
                  <Menu className="h-6 w-6 text-neutral-700 dark:text-neutral-300" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-neutral-50 dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            <div className="px-4 py-3 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                    isActive(link.href)
                      ? "bg-red-600/10 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                      : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-red-600 dark:hover:text-red-400"
                  )}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center rounded-full px-4 py-2 mt-2 text-base font-medium text-white bg-red-600 shadow hover:bg-red-700 transition"
              >
                Login
              </Link>

              <Link
                href="/join-us"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center rounded-full px-4 py-2 text-base font-medium border border-red-600 text-red-600 hover:bg-red-600/10"
              >
                Join Us
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
