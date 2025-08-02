"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import lightBanner from "@/app/assets/images/banner/light-banner.svg";
import darkBanner from "@/app/assets/images/banner/dark-banner.svg";
import darkBannerPhoto from "@/app/assets/images/banner/dark-banner-photo.svg";
import lightBannerPhoto from "@/app/assets/images/banner/light-banner-photo.svg";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Banner = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const selectedBanner = isDark ? darkBanner : lightBanner;
  const selectedPhoto = isDark ? darkBannerPhoto : lightBannerPhoto;

  if (!mounted) return null;

  return (
    <div className="w-full pt-16">
      {/* Desktop View */}
      <div className="hidden md:block relative w-full">
        <Image
          src={selectedBanner}
          alt="SA Banner Background"
          width={1920}
          height={600}
          className="w-full h-auto object-cover"
          priority
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-6 lg:px-0">
              <div className="text-neutral-900 dark:text-neutral-100 w-full md:w-1/2">
                <h1 className="text-3xl lg:text-5xl font-bold leading-tight">
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
                <p className="mt-4 text-sm md:text-lg text-neutral-700 dark:text-neutral-300 max-w-md">
                  Step into leadership. Represent your peers. Make a difference.
                </p>
                <Link href={"/join-us"}>
                  <Button className="mt-4 cursor-pointer">Join Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div
        className={`block md:hidden w-full ${
          isDark
            ? "bg-gradient-to-b from-[#200404] to-[#170303]"
            : "bg-[#ffffff]"
        } p-4`}
      >
        {/* Mobile Image (Centered by default) */}
        <Image
          src={selectedPhoto}
          alt="SA Banner Mobile"
          width={1080}
          height={600}
          className="w-full h-auto object-cover mx-auto"
          priority
        />

        {/* Mobile Text BELOW image (Centered) */}
        <div className="w-full py-6 flex justify-center text-center">
          <div className="text-neutral-900 dark:text-neutral-100">
            <h1 className="text-3xl font-bold leading-tight px-4">
              Connect, inspire, and lead as a{" "}
              <span className="relative inline-block text-red-400 dark:text-yellow-300">
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
                    className="text-red-200 dark:text-yellow-200"
                  />
                </svg>
              </span>
            </h1>
            <p className="mt-3 text-sm text-neutral-700 dark:text-neutral-300">
              Step into leadership. Represent your peers. Make a difference.
            </p>
            <Link href={"/join-us"}>
              <Button className="mt-3 w-full cursor-pointer">Join Now</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
