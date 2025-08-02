"use client";

import { useTheme } from "next-themes";
import { Phone, Mail, MessageCircle, FileText } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const leadTasks = [
  {
    icon: <Phone className="w-5 h-5 text-primary" />,
    title: "Calling Leads",
    description: "Follow up with prospective students through voice calls.",
  },
  {
    icon: <Mail className="w-5 h-5 text-primary" />,
    title: "Email Communication",
    description: "Send formal emails and respond to inquiries professionally.",
  },
  {
    icon: <MessageCircle className="w-5 h-5 text-primary" />,
    title: "WhatsApp Follow-ups",
    description: "Engage leads via WhatsApp with reminders and updates.",
  },
  {
    icon: <FileText className="w-5 h-5 text-primary" />,
    title: "Data Entry",
    description: "Input and update accurate information into the system.",
  },
];

const LmuTasks = () => {
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
        isDark ? "bg-gradient-to-b from-[#000000] to-[#170303]" : "bg-[#F9FAFB]"
      }`}
    >
      <div className="max-w-7xl mx-auto text-center mb-10">
        <Phone className="w-10 h-10 mx-auto text-primary mb-4" />
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          Leads Management Unit
        </h2>
        <p className="text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300 mb-8 md:mb-12 max-w-2xl mx-auto">
          Responsible for reaching out to prospective students via calls,
          emails, and WhatsApp while managing lead information and ensuring
          accurate data entry.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {leadTasks.map((item, index) => (
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

export default LmuTasks;
