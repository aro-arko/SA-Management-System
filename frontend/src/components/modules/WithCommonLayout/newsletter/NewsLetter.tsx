"use client";

import { useEffect, useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

const NewsLetter = () => {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
    setEmail("");
  };

  return (
    <section
      className={`pt-12 pb-8 px-4 sm:px-6 lg:px-0 ${
        isDark ? "bg-gradient-to-b from-[#000000] to-[#170303]" : "bg-[#F9FAFB]"
      }`}
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className={`relative px-6 py-8 rounded-xl shadow-md border transition-all duration-300 ${
            isDark
              ? "bg-[#1a1a1a]/40 backdrop-blur-md border-[#2a2a2a] hover:bg-[#2c2c2c]/60 hover:border-[#444]"
              : "bg-white border-neutral-200 hover:shadow-lg hover:border-neutral-300"
          }`}
        >
          {/* Icon */}
          <div className="relative w-14 h-14 mx-auto mb-4">
            {/* Pulsing ring behind */}
            <span className="absolute inset-0 rounded-full bg-red-500 opacity-30 animate-ping" />

            {/* Icon container with gradient and glow */}
            <div className="relative z-10 flex items-center justify-center w-full h-full rounded-full bg-gradient-to-br from-red-500 via-red-600 to-red-700">
              <Mail className="text-white w-6 h-6" />
            </div>
          </div>

          {/* Title & Description */}
          <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            Stay Connected
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mt-1 text-sm max-w-sm mx-auto">
            Get the latest SA updates, tips, and events — straight to your
            inbox.
          </p>

          {/* Form / Confirmation */}
          {submitted ? (
            <div className="mt-6 flex flex-col items-center text-green-600 animate-fade-in">
              <CheckCircle2 className="w-7 h-7 mb-1" />
              <p className="text-base font-medium">You&apos;re subscribed!</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="mt-6 flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="max-w-sm w-full"
                required
              />
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-6"
              >
                Subscribe
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default NewsLetter;
