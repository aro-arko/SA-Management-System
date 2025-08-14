/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { loginUser } from "@/services/AuthService";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import loginImage from "@/app/assets/images/login/login.png";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export default function LoginForm() {
  const form = useForm({
    resolver: zodResolver(loginValidation),
  });

  const {
    formState: { isSubmitting },
  } = form;

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirectPath");

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    try {
      const res = await loginUser(data);
      if (res?.success) {
        toast.success(res?.message);

        Cookies.set("accessToken", res.data.accessToken, {
          path: "/",
          expires: 1,
          sameSite: "Lax",
          secure: process.env.NODE_ENV === "production",
        });

        const user = jwtDecode(res.data.accessToken) as { role: string };

        if (redirect) {
          router.push(redirect);
        } else {
          if (user.role === "coordinator") {
            router.push(`/${user.role}/dashboard`);
          } else {
            router.push(`/${user.role.toLocaleLowerCase()}/my-tasks`);
          }
        }
      } else {
        toast.error(res?.message || "Login failed.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error("Something went wrong.");
    }
  };

  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = (theme === "system" ? systemTheme : theme) === "dark";

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

  return (
    <section
      className={`min-h-screen flex items-center justify-center pt-16 pb-16 px-4 transition-colors duration-500 ${
        isDark
          ? "bg-gradient-to-b from-[#000000] to-[#170303]"
          : "bg-gradient-to-b from-[#ffffff] to-[#f7f7f7]"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col md:flex-row gap-8 w-full max-w-7xl rounded-xl shadow-md p-6 backdrop-blur-lg border bg-white/90 dark:bg-white/5 dark:text-white"
      >
        {/* Image Section */}
        <div className="hidden md:block w-1/2">
          <Image
            src={loginImage}
            alt="Login"
            className="rounded-xl object-cover h-full w-full"
            priority
          />
        </div>

        {/* Form Section */}
        <div className="w-full md:w-1/2 p-2 md:p-6 flex flex-col justify-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-center text-neutral-900 dark:text-neutral-100">
            Welcome Back! 👋
          </h2>
          <p className="text-neutral-700 dark:text-neutral-300 mb-8 md:mb-12 text-center">
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
                        autoComplete="username"
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
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* Forgot password link */}
              <div className="flex justify-end">
                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-red-600 hover:text-red-700 hover:underline focus:underline focus:outline-none"
                  aria-label="Forgot your password? Reset it"
                >
                  Forgot password?
                </Link>
              </div>

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
