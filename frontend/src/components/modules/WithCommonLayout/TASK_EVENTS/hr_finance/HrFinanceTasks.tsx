"use client";

import { useTheme } from "next-themes";
import { UserCog, CalendarCheck, BadgePlus, TimerReset } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const hrTasks = [
  {
    icon: <BadgePlus className="w-5 h-5 text-primary" />,
    title: "Hiring",
    description: "Conduct interviews and onboard new Student Ambassadors.",
  },
  {
    icon: <TimerReset className="w-5 h-5 text-primary" />,
    title: "Timesheet Checking",
    description:
      "Ensure all working hours are submitted and verified properly.",
  },
  {
    icon: <CalendarCheck className="w-5 h-5 text-primary" />,
    title: "Hour Calculation",
    description: "Calculate monthly working hours for performance tracking.",
  },
  {
    icon: <UserCog className="w-5 h-5 text-primary" />,
    title: "Bonuses & Promotions",
    description: "Review performance data and allocate bonuses or promotions.",
  },
];

const HrFinanceTasks = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <section
      className={`pt-12 pb-16 px-4 sm:px-6 lg:px-0 ${
        isDark ? "bg-gradient-to-b from-[#000000] to-[#170303]" : "bg-[#ffffff]"
      }`}
    >
      <div className="max-w-7xl mx-auto text-center mb-10">
        <UserCog className="w-10 h-10 mx-auto text-primary mb-4" />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          HR & Finance Department
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300 mb-8 md:mb-12 max-w-2xl mx-auto">
          Managing recruitment, timesheets, working hours, and internal
          promotions for a smooth operational workflow.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {hrTasks.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            className={`flex flex-col items-start gap-3 p-5 rounded-xl border shadow-sm transition-all ${
              isDark
                ? "bg-[#1a1a1a]/40 backdrop-blur-md border-[#2a2a2a] text-neutral-100 hover:bg-[#2c2c2c]/60 hover:border-[#444]"
                : "bg-white border-neutral-200 text-neutral-900 hover:shadow-md hover:border-neutral-300"
            }`}
          >
            <div>{item.icon}</div>
            <div>
              <h3 className="font-semibold text-base">{item.title}</h3>
              <p className="text-sm mt-1">{item.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default HrFinanceTasks;
