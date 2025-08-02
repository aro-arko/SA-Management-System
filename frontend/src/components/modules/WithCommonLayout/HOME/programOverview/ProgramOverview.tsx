"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Sparkles, Users, Star, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const points = [
  {
    icon: <Sparkles className="w-6 h-6 text-primary" />,
    title: "Personal Growth",
    description:
      "Build confidence, communication, and leadership skills that stay for life.",
  },
  {
    icon: <Users className="w-6 h-6 text-primary" />,
    title: "Community Impact",
    description: "Represent your peers and create meaningful change on campus.",
  },
  {
    icon: <Star className="w-6 h-6 text-primary" />,
    title: "Exclusive Opportunities",
    description:
      "Get access to events, networking, and resume-worthy experience.",
  },
  {
    icon: <Rocket className="w-6 h-6 text-primary" />,
    title: "Career Boost",
    description:
      "Stand out to employers with hands-on leadership and project involvement.",
  },
];

const ProgramOverview = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setMounted(true);
    }, 600); // Optional delay to simulate loading

    return () => clearTimeout(timeout);
  }, []);

  const isDark = resolvedTheme === "dark";

  // 🧊 Show Skeleton Before Return
  if (!mounted) {
    return (
      <section className="pt-8 md:pt-16 pb-8 px-4 sm:px-6 lg:px-0">
        <div className="max-w-7xl mx-auto text-center">
          <Skeleton className="h-8 w-2/3 mx-auto mb-4 bg-neutral-200 dark:bg-neutral-800" />
          <Skeleton className="h-4 w-4/5 mx-auto mb-8 bg-neutral-200 dark:bg-neutral-800" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="rounded-xl border p-6 shadow-md bg-neutral-100 dark:bg-[#1a1a1a]/40 border-neutral-200 dark:border-[#2a2a2a]"
              >
                <Skeleton className="h-6 w-6 mx-auto mb-4 bg-neutral-300 dark:bg-neutral-700" />
                <Skeleton className="h-5 w-2/3 mx-auto mb-2 bg-neutral-300 dark:bg-neutral-700" />
                <Skeleton className="h-3 w-full bg-neutral-200 dark:bg-neutral-700 mb-1" />
                <Skeleton className="h-3 w-3/4 bg-neutral-200 dark:bg-neutral-700" />
              </div>
            ))}
          </div>

          <Skeleton className="h-10 w-36 mx-auto bg-neutral-300 dark:bg-neutral-700" />
        </div>
      </section>
    );
  }

  // ✅ Return Actual Content After Mount
  return (
    <section
      className={`pt-8 md:pt-16 pb-8 px-4 sm:px-6 lg:px-0 ${
        isDark ? "bg-gradient-to-b from-[#000000] to-[#170303]" : "bg-[#F9FAFB]"
      }`}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          What is this Program?
        </h2>
        <p className="text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 md:mb-12">
          Join a community of changemakers. As a Student Ambassador, you’ll lead
          with purpose, inspire others, and grow both personally and
          professionally.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-10">
          {points.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-xl border p-6 shadow-md transition-all duration-300 ${
                isDark
                  ? "bg-[#1a1a1a]/40 backdrop-blur-md border-[#2a2a2a] text-neutral-100 hover:bg-[#2c2c2c]/60 hover:border-[#444]"
                  : "bg-white border-neutral-200 text-neutral-900 hover:shadow-md hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center justify-center mb-4">
                {point.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                {point.title}
              </h3>
              <p className="text-sm sm:text-base">{point.description}</p>
            </motion.div>
          ))}
        </div>

        <Link href="/about-us">
          <Button className="cursor-pointer">Learn More</Button>
        </Link>
      </div>
    </section>
  );
};

export default ProgramOverview;
