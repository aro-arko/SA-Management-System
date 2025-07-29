"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import lightBanner from "@/app/assets/images/banner/light-banner.svg";
import darkBanner from "@/app/assets/images/banner/dark-banner.svg";

const Banner = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedBanner = resolvedTheme === "dark" ? darkBanner : lightBanner;

  return (
    <div className="relative w-full">
      {/* Banner Image */}
      {mounted && (
        <Image
          src={selectedBanner}
          alt="SA Banner"
          width={1920}
          height={600}
          className="w-full h-auto object-cover"
          priority
        />
      )}

      {/* Text Overlay */}
      {mounted && (
        <div className="absolute inset-0 flex items-center">
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0">
              <div className=" dark:text-neutral-100 w-full md:w-1/2">
                <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                  Connect, inspire, and lead as a{" "}
                  <span className="relative inline-block text-red-500 dark:text-yellow-400">
                    Student Ambassador
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 200 20"
                      className="absolute bottom-0 left-0 w-full h-2"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0,10 C50,25 150,-5 200,10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        className="text-red-300 dark:text-yellow-300"
                      />
                    </svg>
                  </span>
                </h1>
                <p className="mt-4 text-sm md:text-lg  dark:text-neutral-300 max-w-md">
                  Step into leadership. Represent your peers. Make a difference.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
