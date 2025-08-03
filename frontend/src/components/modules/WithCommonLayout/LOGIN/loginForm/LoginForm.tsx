"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidation } from "./loginValidation";
import { toast } from "sonner";
import { getCurrentUser, loginUser } from "@/services/AuthService";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import loginImage from "@/app/assets/images/login/login.png";

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginValidation),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const router = useRouter();
  // const searchParams = useSearchParams();
  // const redirect = searchParams.get("redirectPath");

  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;
  const isDark = currentTheme === "dark";

  // Avoid UI flicker during theme hydration
  if (!mounted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 bg-gray-200 dark:bg-gradient-to-b from-[#000000] to-[#170303]">
        <div className="flex flex-col md:flex-row gap-8 max-w-7xl w-full">
          <div className="hidden md:block w-1/2 space-y-4">
            <Skeleton className="h-[300px] w-full rounded-xl" />
          </div>
          <div className="w-full md:w-1/2 space-y-4 p-4 sm:p-6">
            <Skeleton className="h-8 w-2/3 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <div className="space-y-4 mt-4">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-5 w-20 mt-2" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full mt-6" />
          </div>
        </div>
      </section>
    );
  }

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await loginUser(data);
      console.log(res);
      if (res?.success) {
        toast.success(res?.message);
        const user = await getCurrentUser();
      } else {
        toast.error(res?.message);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast.error("Login failed.");
    }
  };

  return (
    <section
      className={`min-h-screen md:min-h-auto flex items-center justify-center pt-16 pb-16 px-4 sm:px-6 lg:px-8 transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-b from-[#000000] to-[#170303]"
          : "bg-gradient-to-b from-[#ffffff] to-[#f7f7f7]"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row gap-8 w-full max-w-7xl rounded-xl shadow-md p-6 backdrop-blur-lg border light:border-gray-200 bg-white/90 dark:bg-white/5 dark:border dark:text-white"
      >
        {/* Illustration (Desktop only) */}
        <div className="hidden md:block w-1/2">
          <Image
            src={loginImage}
            alt="Login"
            className="rounded-xl object-cover h-full w-full"
            priority
          />
        </div>

        {/* Login Form */}
        <div className="w-full md:w-1/2 p-2 md:p-6 flex flex-col justify-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-neutral-900 dark:text-neutral-100 text-center">
            Welcome Back!👋
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-700 dark:text-neutral-300 mb-8 md:mb-12 max-w-2xl mx-auto">
            Log in to access your SA dashboard
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        className="bg-transparent"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className="bg-transparent"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </Form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              New here and want to get involved?{" "}
              <Link
                href="/join-us"
                className="text-red-600 font-semibold hover:underline"
              >
                Join Us
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
