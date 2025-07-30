"use client";

import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import {
  ClipboardList,
  Megaphone,
  Users2,
  Activity,
  ThumbsUp,
} from "lucide-react";
import { motion } from "framer-motion";

const roles = [
  {
    icon: <ClipboardList className="w-6 h-6 text-primary" />,
    title: "Campus Representation",
    description:
      "Be the voice of your peers and represent student concerns to faculty.",
  },
  {
    icon: <Megaphone className="w-6 h-6 text-primary" />,
    title: "Event Promotion",
    description:
      "Spread the word about university events and engage your network.",
  },
  {
    icon: <Users2 className="w-6 h-6 text-primary" />,
    title: "Peer Support",
    description:
      "Mentor new students and foster a positive, inclusive environment.",
  },
  {
    icon: <Activity className="w-6 h-6 text-primary" />,
    title: "Initiative Taking",
    description: "Launch campaigns and ideas that improve student experience.",
  },
  {
    icon: <ThumbsUp className="w-6 h-6 text-primary" />,
    title: "Professional Conduct",
    description:
      "Maintain respectful, responsible behavior as a student leader.",
  },
];

const RolesExpectations = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  if (!mounted) return null;

  return (
    <section
      className={`pt-16 pb-8 px-4 sm:px-6 lg:px-0 ${
        isDark ? "bg-gradient-to-b from-[#000000] to-[#170303]" : "bg-[#fdfdfd]"
      }`}
    >
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
          Roles & Expectations
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300 mb-12 max-w-2xl mx-auto">
          Being a Student Ambassador is more than just a title; it’s about
          responsibility, initiative, and creating a lasting impact on your
          campus.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {roles.map((role, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`rounded-xl border p-6 text-left shadow-md transition-all duration-300 ${
                isDark
                  ? "bg-muted/20 border-border hover:bg-[#2c2c2c] hover:border-[#444]"
                  : "bg-white border-neutral-200 hover:shadow-lg hover:border-neutral-300"
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div>{role.icon}</div>
                <h3 className="text-lg font-semibold">{role.title}</h3>
              </div>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                {role.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RolesExpectations;
