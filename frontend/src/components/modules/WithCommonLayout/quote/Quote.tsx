"use client";

import { Lightbulb } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const Quote = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const quote =
    "Start your day with intention – a clear mind leads to better focus.";
  const author = "UCSI Mentor Team";

  return (
    <section
      className={`pt-8 md:pt-16 pb-8 px-4 sm:px-6 lg:px-0 ${
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
          <Lightbulb className="absolute top-6 left-6 text-yellow-500 dark:text-yellow-400 w-6 h-6 opacity-70" />

          <h2 className="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
            Quote of the Day
          </h2>

          <p className="text-neutral-700 dark:text-neutral-300 italic max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            “{quote}”
          </p>

          <div className="mt-5 text-sm font-semibold text-neutral-800 dark:text-neutral-100 tracking-wide uppercase">
            — {author}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Quote;
