"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Menu,
  X,
  User as UserIcon,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import darkLogo from "@/app/assets/images/sa sec logo dark.png";
import lightLogo from "@/app/assets/images/sa sec logo.png";
import { useTheme } from "next-themes";
import { ModeToggle } from "./ThemeToggler/ThemeToggler";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/context/UserContext";
import { logout } from "@/services/AuthService";
import { protectedRoutes } from "@/constants";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Tasks & Events", href: "/tasks-events" },
  { name: "About", href: "/about" },
  { name: "FAQs", href: "/faq" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { refreshUser, setUser } = useUser();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, setIsLoading } = useUser();
  const roleSlug = (user?.role || "").toLowerCase();
  const dashboardHref =
    roleSlug === "coordinator"
      ? "/coordinator/dashboard"
      : `/${roleSlug}/my-tasks`;

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const isActive = (path: string) => pathname === path;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onLogout = async () => {
    try {
      await logout(); // deletes cookie on server
    } finally {
      // broadcast to the whole app
      try {
        new BroadcastChannel("auth").postMessage("logout");
      } catch {}
      try {
        localStorage.setItem("auth:ping", String(Date.now()));
      } catch {}

      setUser(null);
      await refreshUser();
      router.refresh();

      if (protectedRoutes.some((route) => pathname.match(route))) {
        router.push("/");
      }
    }
  };

  return (
    <nav
      className={cn(
        "fixed w-full z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-white/90 dark:bg-gradient-to-b from-[#000000] to-[#170303] backdrop-blur-md shadow-sm border-neutral-200 dark:border-neutral-900"
          : "bg-white dark:bg-gradient-to-b from-[#000000] to-[#170303] border-neutral-200 dark:border-neutral-800"
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
          <div className="flex items-center space-x-2 md:space-x-4 lg:space-x-0">
            <div className="mr-2">
              <ModeToggle />
            </div>

            {/* If NOT logged in → Login/Join */}
            {!user && (
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
            )}

            {/* If logged in → Profile dropdown */}
            {user && (
              <div className="hidden md:flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="rounded-full px-3 py-2 h-9"
                      aria-label="Account menu"
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      <span className="text-sm">Account</span>
                      <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 border border-neutral-200 dark:border-neutral-800"
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col">
                        <span className="text-xs text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link
                        href={dashboardHref}
                        className="w-full flex items-center"
                      >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogout} className="">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}

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

              {/* Mobile account section */}
              {user ? (
                <>
                  <Link
                    href={dashboardHref}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </span>
                  </Link>

                  <button
                    onClick={async () => {
                      setIsMobileMenuOpen(false);
                      await onLogout();
                    }}
                    className="block w-full text-left rounded-md px-3 py-2 text-base font-medium text-red-600 hover:bg-red-600/10"
                  >
                    <span className="inline-flex items-center gap-2">
                      <LogOut className="h-4 w-4" />
                      Log out
                    </span>
                  </button>
                </>
              ) : (
                <>
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
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
