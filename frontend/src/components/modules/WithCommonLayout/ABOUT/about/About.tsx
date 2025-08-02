"use client";

import { useTheme } from "next-themes";
import { Star, Users, Globe, BookOpen } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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
    image: "https://i.ibb.co/svJQBVPh/Abidur-Rahman-Arko.png",
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
        <div className="text-center space-y-4">
          <Skeleton className="h-8 w-52 mx-auto" />
          <Skeleton className="h-4 w-3/5 mx-auto" />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="space-y-4 md:w-2/3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-56 w-full md:w-1/3 rounded-lg" />
        </div>

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
    <div
      className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 py-16 ${
        isDark ? "text-neutral-100" : "text-neutral-900"
      }`}
    >
      {/* Overview Section */}
      <section className="text-center mb-16">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
          About SA
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-neutral-600 dark:text-neutral-300">
          The SA Program at UCSI empowers students to lead and represent the
          university through meaningful initiatives.
        </p>
      </section>

      {/* Mission Statement */}
      <section className="mb-16 flex flex-col md:flex-row items-center gap-8">
        <div className="space-y-6 md:w-2/3">
          <h2 className="text-3xl font-bold">Our Mission</h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-justify">
            To foster leadership, communication, and teamwork among UCSI
            students through active involvement in university events and
            initiatives. The SA Program offers hands-on experience that empowers
            members to grow academically, socially, and professionally—preparing
            them for success in both campus life and future careers.
          </p>
          <div className="flex items-center gap-4">
            <Star className="h-8 w-8 text-red-600" />
            <span className="font-semibold">
              Engaging, Empowering, and Leading to Employment!
            </span>
          </div>
        </div>
        <div className="md:w-1/3 flex h-56 justify-end">
          <Image
            src={goalImage}
            alt="Mission"
            width={400}
            height={100}
            className="rounded-lg shadow-lg object-cover h-full w-full"
          />
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Meet Our Team</h2>
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
      </section>

      {/* Success Stories */}
      <section className="mb-16 text-center">
        <h2 className="text-3xl font-bold mb-8">Success Stories</h2>
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
      </section>

      {/* Vision Section */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-8">Our Vision</h2>
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
      </section>
    </div>
  );
};

export default About;
