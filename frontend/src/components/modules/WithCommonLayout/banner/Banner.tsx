"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import banner1 from "@/app/assets/images/banner/banner 1.png";

const images = [banner1, banner1];

const Banner = () => {
  const [current, setCurrent] = useState(0);
  const length = images.length;

  const nextSlide = () =>
    setCurrent((prev) => (prev === length - 1 ? 0 : prev + 1));
  const prevSlide = () =>
    setCurrent((prev) => (prev === 0 ? length - 1 : prev - 1));

  // Optional auto-slide
  useEffect(() => {
    const timer = setInterval(() => nextSlide(), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-64 md:h-96 overflow-hidden">
      {/* Slides */}
      <div
        className="flex transition-transform ease-in-out duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {images.map((img, index) => (
          <div key={index} className="min-w-full h-64 md:h-96 relative">
            <Image
              src={img}
              alt={`Slide ${index + 1}`}
              fill
              className="object-cover"
              priority={index === 0}
            />
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 z-10 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 p-2 rounded-full shadow"
      >
        <svg
          className="w-5 h-5 text-gray-800"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 z-10 transform -translate-y-1/2 bg-white/70 hover:bg-white/90 p-2 rounded-full shadow"
      >
        <svg
          className="w-5 h-5 text-gray-800"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {images.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 rounded-full ${
              current === idx ? "bg-white" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;
