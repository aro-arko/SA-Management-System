/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import { motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import clsx from "clsx";

import { resetPassword } from "@/services/AuthService";

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

const schema = z
  .object({
    email: z.string().email("Please enter a valid email address"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
    confirmPassword: z.string(),
  })
  .refine((vals) => vals.newPassword === vals.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = (theme === "system" ? systemTheme : theme) === "dark";

  const emailFromUrl = (searchParams.get("email") || "").trim();
  const tokenFromUrl = (searchParams.get("token") || "").trim();

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      email: emailFromUrl,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const {
    formState: { isSubmitting },
    setValue,
  } = form;

  // Keep email in sync if URL changes (rare, but safe)
  useEffect(() => {
    if (emailFromUrl) setValue("email", emailFromUrl);
  }, [emailFromUrl, setValue]);

  const pageBg = clsx(
    "min-h-screen flex items-center justify-center px-4 py-16 transition-colors duration-500",
    isDark
      ? "bg-gradient-to-b from-[#000000] to-[#170303]"
      : "bg-gradient-to-b from-[#ffffff] to-[#f7f7f7]"
  );

  const missingParams = useMemo(
    () => !emailFromUrl || !tokenFromUrl,
    [emailFromUrl, tokenFromUrl]
  );

  // Hydration-safe skeleton while theme resolves
  if (!mounted) {
    return (
      <section className="min-h-screen flex items-center justify-center px-4 bg-gray-200 dark:bg-gradient-to-b from-[#000000] to-[#170303]">
        <div className="max-w-lg w-full space-y-4 p-4 sm:p-6">
          <Skeleton className="h-8 w-2/3 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <div className="space-y-4 mt-4">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-full mt-6" />
        </div>
      </section>
    );
  }

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    if (missingParams) {
      toast.error("Invalid or missing reset link. Please request again.");
      return;
    }

    try {
      const payload = {
        email: values.email as string,
        newPassword: values.newPassword as string,
      };

      const res = await resetPassword(payload, tokenFromUrl);

      if (res?.success) {
        toast.success(res?.message || "Password has been reset successfully.");
        router.push("/login?reset=success");
      } else {
        toast.error(res?.message || "Failed to reset password.");
      }
    } catch (e: any) {
      toast.error(e?.message || "Something went wrong.");
    }
  };

  return (
    <section className={pageBg}>
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="w-full max-w-lg rounded-xl shadow-md p-6 backdrop-blur-lg border bg-white/90 dark:bg-white/5 dark:text-white"
      >
        <h1 className="text-3xl font-bold text-center mb-2">Reset Password</h1>
        <p className="text-center text-sm text-neutral-700 dark:text-neutral-300 mb-8">
          Choose a strong new password for your account.
        </p>

        {missingParams ? (
          <div className="space-y-4 text-center">
            <p className="text-sm">
              Your reset link is invalid or expired. Please request a new one.
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/forgot-password">
                <Button className="bg-red-600 hover:bg-red-700">
                  Request new link
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Back to login</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5"
              >
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
                          readOnly
                          className="bg-transparent opacity-70 cursor-not-allowed"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="At least 8 characters"
                          className="bg-transparent"
                          autoComplete="new-password"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500 text-sm" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Re-type your new password"
                          className="bg-transparent"
                          autoComplete="new-password"
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
                  {isSubmitting ? "Updating…" : "Reset Password"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don’t need this?{" "}
                <Link
                  href="/login"
                  className="text-red-600 font-semibold hover:underline"
                >
                  Back to login
                </Link>
              </p>
            </div>
          </>
        )}
      </motion.div>
    </section>
  );
}
