"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Star, Users, Globe, BookOpen } from "lucide-react";
import goalImage from "@/app/assets/images/about/goal.jpg";

const team = [
  {
    name: "Parameswari A/P Karunganam",
    role: "Coordinator",
    image:
      "https://img.freepik.com/premium-photo/portrait-professional-woman-suit-business-woman-standing-office-generative-ai_868783-4132.jpg",
  },
  {
    name: "Chin Xin Nuo",
    role: "Head",
    image:
      "https://img.freepik.com/free-photo/young-bearded-man-with-striped-shirt_273609-5677.jpg",
  },
  {
    name: "Chong Wei",
    role: "Deputy Head",
    image:
      "https://media.istockphoto.com/id/1399565382/photo/young-happy-mixed-race-businessman-standing-with-his-arms-crossed-working-alone-in-an-office.webp?b=1&s=612x612&w=0&k=20&c=nMpH7tfH___WoQzbtoytLfYhwb3pgpDXXJyEHzwhgIM=",
  },
  {
    name: "Aro Arko",
    role: "Chief Technology Officer (CTO)",
    image:
      "https://www.aro-arko.software/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FprofileImage.497e7112.jpg&w=1920&q=75",
  },
];

const successStories = [
  {
    name: "Adriana",
    story:
      "Becoming a Student Ambassador gave me the confidence and experience I needed for my future career.",
    image:
      "https://i.pinimg.com/736x/32/10/8a/32108a13a9753d5569a5a587cc22452e.jpg",
  },
  {
    name: "Zhi Hao",
    story:
      "The SA program helped me grow as a leader and opened doors to new opportunities I never imagined.",
    image:
      "https://img.freepik.com/premium-photo/boy-student-chinese-portrait-standing-smiling_53876-289705.jpg",
  },
  {
    name: "Maya",
    story:
      "I’ve learned so much by participating in events and leading initiatives. The experience was unforgettable!",
    image:
      "https://images.stockcake.com/public/8/1/3/8131eb96-18fd-4112-8459-28613801e8b4_medium/graduate-s-joyful-moment-stockcake.jpg",
  },
];

const vision = [
  {
    icon: <Globe className="h-12 w-12 text-red-600 mx-auto" />,
    title: "Global Readiness",
    description:
      "Prepare students for global careers through skill-building and real-world exposure.",
  },
  {
    icon: <BookOpen className="h-12 w-12 text-red-600 mx-auto" />,
    title: "Personal Growth",
    description:
      "Empower ambassadors with leadership, communication, and teamwork experience.",
  },
  {
    icon: <Users className="h-12 w-12 text-red-600 mx-auto" />,
    title: "Community Impact",
    description:
      "Support UCSI’s events and outreach by building strong student-led teams.",
  },
];

const About = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isDark = resolvedTheme === "dark";

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 600);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-16 space-y-10">
        <Skeleton className="h-8 w-52 mx-auto" />
        <Skeleton className="h-4 w-3/5 mx-auto" />
        <Skeleton className="h-56 w-full rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-3 text-center">
              <Skeleton className="h-36 w-36 rounded-full mx-auto" />
              <Skeleton className="h-4 w-2/3 mx-auto" />
              <Skeleton className="h-3 w-1/2 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section
      className={`pt-12 pb-16 px-4 sm:px-6 lg:px-0 ${
        isDark ? "bg-gradient-to-b from-[#000000] to-[#170303]" : "bg-[#ffffff]"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto text-center mb-16"
      >
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          About Us
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto">
          The SA Program at UCSI empowers students to lead and represent the
          university through meaningful initiatives.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
        className="mb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-0"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Our Mission
        </h2>

        <div className="flex flex-col-reverse md:flex-row items-center gap-8">
          {/* Left: Mission Text */}
          <div className="space-y-6 md:w-2/3">
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-300 text-justify">
              To foster leadership, communication, and teamwork among UCSI
              students through active involvement in university events and
              initiatives. The SA Program offers hands-on experience that
              empowers members to grow academically, socially, and
              professionally—preparing them for success in both campus life and
              future careers.
            </p>
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-red-600" />
              <span className="font-semibold">
                Engaging, Empowering, and Leading to Employment!
              </span>
            </div>
          </div>

          {/* Right: Mission Image */}
          <div className="md:w-1/3 w-full flex h-56 justify-end">
            <Image
              src={goalImage}
              alt="Mission"
              width={500}
              height={100}
              className="rounded-lg shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </motion.div>

      {/* Team Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        viewport={{ once: true }}
        className="mb-16 text-center max-w-7xl mx-auto"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">Meet Our Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map(({ name, role, image }, index) => (
            <div key={index}>
              <Image
                src={image}
                alt={name}
                width={150}
                height={150}
                className="rounded-full aspect-square object-cover border-4 border-red-200 shadow-md mx-auto"
              />
              <h3 className="text-xl font-semibold mt-3">{name}</h3>
              <p className="text-neutral-600 dark:text-neutral-400">{role}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Success Stories */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        className="mb-16 text-center max-w-7xl mx-auto"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successStories.map(({ name, story, image }, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl shadow-md border transition duration-300 ${
                isDark
                  ? "bg-[#1a1a1a]/40 backdrop-blur-md border-[#2a2a2a] text-neutral-100 hover:bg-[#2c2c2c]/60 hover:border-[#444]"
                  : "bg-white border-neutral-200 text-neutral-900 hover:shadow-md hover:border-neutral-300"
              }`}
            >
              <Image
                src={image}
                alt={name}
                width={96}
                height={96}
                className="rounded-full aspect-square object-cover border-4 border-red-200 mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold">{name}</h3>
              <p className="italic text-sm text-neutral-600 dark:text-neutral-300">
                &quot;{story}&quot;
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Vision Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        viewport={{ once: true }}
        className="text-center max-w-7xl mx-auto"
      >
        <h2 className="text-2xl sm:text-3xl font-bold mb-8">Our Vision</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {vision.map(({ icon, title, description }, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-md border ${
                isDark
                  ? "bg-[#1a1a1a]/40 backdrop-blur-md border-[#2a2a2a] text-neutral-100 hover:bg-[#2c2c2c]/60 hover:border-[#444]"
                  : "bg-white border-neutral-200 text-neutral-900 hover:shadow-md hover:border-neutral-300"
              }`}
            >
              <div className="mb-4">{icon}</div>
              <h3 className="text-xl font-semibold mb-2">{title}</h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                {description}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default About;
