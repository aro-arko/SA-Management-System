"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { FilePlus, MessageSquare, Rocket, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    title: "Apply",
    description: "Fill out the application form online.",
    icon: FilePlus,
  },
  {
    title: "Interview",
    description: "Have a quick chat with our team.",
    icon: MessageSquare,
  },
  {
    title: "Probation",
    description: "Show your commitment in a trial phase.",
    icon: Rocket,
  },
  {
    title: "Join as SA",
    description: "Officially become a Student Ambassador!",
    icon: CheckCircle,
  },
];

const HowToJoin = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  if (!mounted) return null;

  return (
    <section
      className={`pt-8 md:pt-16 pb-8 px-4 sm:px-6 lg:px-0 ${
        isDark ? "bg-gradient-to-b from-[#000000] to-[#170303]" : "bg-[#ffffff]"
      }`}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
          Joining Process
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300 mb-8 md:mb-12 max-w-2xl mx-auto">
          A simple process to become a Student Ambassador and make a difference
          on campus.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className={`relative rounded-xl border p-6 shadow-md text-left transition-all duration-300 ${
                  isDark
                    ? "bg-muted/20 border-border hover:bg-[#2c2c2c] hover:border-[#444]"
                    : "bg-white border-neutral-200 hover:shadow-lg hover:border-neutral-300"
                }`}
              >
                {/* Step Badge (Top Right) */}
                <div className="absolute top-4 right-4 text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-800 dark:text-white font-medium shadow-sm">
                  Step {index + 1}
                </div>

                {/* Icon */}
                <div className="mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>

                <h3 className="text-lg font-semibold mb-1">{step.title}</h3>
                <p className="text-sm text-neutral-700 dark:text-neutral-300">
                  {step.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowToJoin;
