"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { motion } from "framer-motion";
import "swiper/css";
import { useTheme } from "next-themes";

// Define type outside the component for better structure
interface Testimonial {
  name: string;
  role: string;
  testimonial: string;
  avatar: string;
  rating: number;
}

const SAExperience = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const res = await fetch("https://randomuser.me/api/?results=6");
        const data = await res.json();

        const formattedTestimonials: Testimonial[] = data.results.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (user: any, index: number) => ({
            name: `${user.name.first} ${user.name.last}`,
            role: "Student Ambassador",
            testimonial:
              index % 2 === 0
                ? "Being an SA helped me grow into a confident leader and make a real impact on campus."
                : "Joining the SA program was a turning point — I’ve made lifelong friends and learned so much.",
            avatar: user.picture.large,
            rating: 5,
          })
        );

        setTestimonials(formattedTestimonials);
      } catch (error) {
        console.error("Error fetching testimonials:", error);
      }
    };

    fetchTestimonials();
  }, []);

  if (!mounted) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <section
      className={`pt-8 md:pt-16 pb-8 px-4 sm:px-6 lg:px-0 ${
        isDark ? "bg-gradient-to-b from-[#000000] to-[#170303]" : "bg-[#F9FAFB]"
      }`}
    >
      <div className="max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-neutral-900 dark:text-neutral-100">
            Voices of SA
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300 mb-8 md:mb-12 max-w-2xl mx-auto">
            Discover how the Student Ambassador journey transforms lives through
            leadership, collaboration, and personal growth.
          </p>

          <Swiper
            spaceBetween={30}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
            }}
            modules={[Autoplay]}
            className="w-full"
          >
            {testimonials.map((story, index) => (
              <SwiperSlide key={index} className="flex justify-center">
                <Card
                  className={`px-4 py-5 border shadow-md rounded-xl max-w-[650px] transition-all duration-300 ${
                    isDark
                      ? "bg-white/1 backdrop-blur-sm border-[#2a2a2a] hover:bg-white/10 hover:border-[#444]"
                      : "bg-white border-neutral-200 hover:shadow-lg hover:border-neutral-300"
                  }`}
                >
                  <CardHeader className="flex flex-col items-center space-y-2">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={story.avatar} alt={story.name} />
                      <AvatarFallback>
                        {story.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {story.name}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {story.role}
                    </p>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                      “{story.testimonial}”
                    </p>
                    <div className="flex justify-center mt-3">
                      {Array.from({ length: story.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 text-yellow-400 fill-current"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default SAExperience;
