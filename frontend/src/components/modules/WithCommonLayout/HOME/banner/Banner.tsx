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
import { Skeleton } from "@/components/ui/skeleton";

const Banner = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";
  const selectedBanner = isDark ? darkBanner : lightBanner;
  const selectedPhoto = isDark ? darkBannerPhoto : lightBannerPhoto;

  if (!mounted) {
    return (
      <div className="w-full pt-16 hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 md:px-6 lg:px-0 min-h-[400px]">
          {/* Left side text skeletons */}
          <div className="flex-1 space-y-4">
            <Skeleton className="h-10 w-3/4 rounded-md bg-neutral-200 dark:bg-neutral-800 opacity-90" />
            <Skeleton className="h-10 w-2/3 rounded-md bg-neutral-200 dark:bg-neutral-800 opacity-90" />
            <Skeleton className="h-5 w-1/2 mt-4 bg-neutral-200 dark:bg-neutral-800 opacity-90" />
            <Skeleton className="h-10 w-32 mt-2 rounded-md bg-neutral-200 dark:bg-neutral-800 opacity-90" />
          </div>

          {/* Right side image skeleton */}
          <div className="flex-1 flex justify-end">
            <Skeleton className="h-[300px] w-[300px] rounded-xl bg-neutral-200 dark:bg-neutral-800 opacity-90" />
          </div>
        </div>
      </div>
    );
  }

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
        <Image
          src={selectedPhoto}
          alt="SA Banner Mobile"
          width={1080}
          height={600}
          className="w-full h-auto object-cover mx-auto"
          priority
        />
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
