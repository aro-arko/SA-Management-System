"use client";

import { Lightbulb } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const Quote = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  const quote =
    "Start your day with intention – a clear mind leads to better focus.";
  const author = "UCSI Mentor Team";

  return (
    <section
      className={` pt-8 md:pt-16 pb-8 px-4 sm:px-6 lg:px-0 ${
        isDark ? "bg-gradient-to-b from-[#000000] to-[#170303]" : "bg-[#F9FAFB]"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-neutral-900 dark:text-neutral-100">
          Quote of the Day
        </h2>

        <div
          className={`relative p-8 rounded-xl shadow-md border flex flex-col items-center text-center transition-all duration-300
    ${
      isDark
        ? "bg-[#1a1a1a]/40 backdrop-blur-md border-[#2a2a2a]"
        : "bg-white border-neutral-200"
    }`}
        >
          <Lightbulb className="absolute top-10 left-10 text-yellow-500 dark:text-yellow-400 w-6 h-6 opacity-70" />

          <p className="mt-4 text-neutral-700 dark:text-neutral-300 italic max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            “{quote}”
          </p>

          <div className="mt-6 text-sm font-semibold text-neutral-800 dark:text-neutral-100 tracking-wide uppercase">
            — {author}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Quote;
