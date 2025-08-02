"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

const faqs = [
  {
    question: "What is the SA Program at UCSI?",
    answer:
      "The Student Ambassador (SA) Program offers leadership opportunities, communication development, and event participation to help students grow holistically.",
  },
  {
    question: "Who can join the SA Program?",
    answer:
      "All UCSI students are welcome to apply. The program encourages participation from diverse faculties and backgrounds.",
  },
  {
    question: "What are the benefits of joining SA?",
    answer:
      "SA members gain practical leadership experience, event management skills, and networking opportunities for personal and professional growth.",
  },
  {
    question: "Are SA members paid?",
    answer:
      "Yes, SA members are paid RM 7 per hour. In addition to the hourly pay, they may also receive bonuses, performance-based incentives, and exclusive recognition.",
  },
  {
    question: "How can I apply to be a Student Ambassador?",
    answer:
      "Watch out for our recruitment cycles! You can apply through the official form shared via email or announcements on campus.",
  },
];

const FAQComponent = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 500);
    return () => clearTimeout(timer);
  }, []);

  const isDark = resolvedTheme === "dark";
  const sectionBg = isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303]"
    : "bg-[#ffffff]";

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 lg:px-0 space-y-6">
        <div className="text-center space-y-3">
          <Skeleton className="h-8 w-52 mx-auto" />
          <Skeleton className="h-4 w-3/5 mx-auto" />
        </div>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-md" />
        ))}
      </div>
    );
  }

  return (
    <section className={`${sectionBg} py-16 px-4 sm:px-6 lg:px-0`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
            Frequently Asked Questions
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Find answers about our SA program and how to get involved.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <AccordionItem
                value={`item-${index}`}
                className={`rounded-lg px-6 py-2 transition-all ${
                  isDark
                    ? "bg-[#1a1a1a]/50 border border-[#2a2a2a] text-neutral-100 hover:bg-[#2c2c2c]/70 hover:border-[#444]"
                    : "bg-white border border-neutral-200 text-neutral-900 shadow-sm hover:shadow-md hover:border-neutral-300"
                }`}
              >
                <AccordionTrigger className="text-left font-medium py-4 hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="pb-4 text-neutral-600 dark:text-neutral-300">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>

        <div className="mt-12 text-center">
          <h3 className="text-lg font-medium mb-4">Still have questions?</h3>
          <p className="text-neutral-600 dark:text-neutral-300 mb-6">
            Contact our team and we’ll be happy to assist you.
          </p>
          <Link href="/contact">
            <Button className="bg-primary text-white hover:bg-primary/90">
              Contact Support
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};

export default FAQComponent;
