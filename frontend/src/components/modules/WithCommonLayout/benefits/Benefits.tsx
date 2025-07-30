"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Briefcase, Users2, FileText, Mic, CalendarCheck } from "lucide-react";
import benefitIllustration from "@/app/assets/images/benefits/benefits-bg.svg";
import { motion } from "framer-motion";

const benefits = [
  {
    icon: <Briefcase className="w-5 h-5 text-primary" />,
    title: "Leadership Experience",
    description: "Build real-world leadership and decision-making skills.",
  },
  {
    icon: <Users2 className="w-5 h-5 text-primary" />,
    title: "Networking Opportunities",
    description: "Connect with faculty, professionals, and like-minded peers.",
  },
  {
    icon: <FileText className="w-5 h-5 text-primary" />,
    title: "Resume Enhancement",
    description: "Stand out with experience that employers value.",
  },
  {
    icon: <Mic className="w-5 h-5 text-primary" />,
    title: "Skill Development",
    description:
      "Sharpen your communication, event planning, and public speaking.",
  },
  {
    icon: <CalendarCheck className="w-5 h-5 text-primary" />,
    title: "Exclusive Events",
    description: "Access workshops, seminars, and VIP events.",
  },
];

const Benefits = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <section
      className={`pt-16 pb-8 px-4 sm:px-6 lg:px-0 ${
        isDark ? "bg-gradient-to-b from-[#000000] to-[#170303]" : "bg-[#ffffff]"
      }`}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center text-neutral-900 dark:text-neutral-100 mb-12">
        Why Become a Student Ambassador?
      </h2>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
        {/* Left Illustration */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="w-full lg:w-1/2"
        >
          <div
            className={`relative rounded-2xl overflow-hidden shadow-lg transition-all duration-300 w-full ${
              isDark
                ? "bg-[#0f0f0f] border border-neutral-800"
                : "bg-[#f5f5f5] border border-neutral-200"
            } p-2 hover:shadow-xl`}
          >
            <Image
              src={benefitIllustration}
              alt="Benefits Illustration"
              width={1920}
              height={1080}
              className="rounded-xl object-cover w-full h-full max-h-[450px] transition-transform duration-300 hover:scale-[1.001]"
              priority
            />
          </div>
        </motion.div>

        {/* Right Compact Cards */}
        <div className="w-full lg:w-1/2 space-y-3">
          {benefits.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`flex items-start gap-3 p-4 rounded-lg border shadow-sm transition ${
                isDark
                  ? "bg-[#1a1a1a] border-[#2a2a2a] text-neutral-100 hover:bg-[#2c2c2c] hover:border-[#444]"
                  : "bg-white border-neutral-200 text-neutral-900 hover:shadow-md hover:border-neutral-300"
              }`}
            >
              <div className="mt-1">{item.icon}</div>
              <div>
                <h3 className="font-semibold text-base">{item.title}</h3>
                <p className="text-sm mt-1">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
