/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { useTheme } from "next-themes";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { applyJoinUs } from "@/services/JoinUsService";

// If you already have this type elsewhere, import it and remove this.
type TApplicationFormData = {
  fullName: string;
  studentId: number;
  expectedGraduationDate: string; // ISO string e.g. 2026-06-01T00:00:00.000Z
  email: string;
  phoneNumber: number;
  Faculty: string;
  Major: string;
  ResumeLink: string;
};

const nice = (s: string) => (s ?? "").trim();
const toISOStartOfDayUTC = (yyyyMmDd: string) =>
  yyyyMmDd ? `${yyyyMmDd}T00:00:00.000Z` : "";

export default function JoinUsApplication() {
  const { resolvedTheme } = useTheme();

  // --- hydration-safe theme gate to avoid mismatch ---
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = mounted && resolvedTheme === "dark";

  // --- form state ---
  const [fullName, setFullName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [gradDate, setGradDate] = useState(""); // yyyy-MM-dd
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // keep text to preserve leading digits
  const [faculty, setFaculty] = useState("");
  const [major, setMajor] = useState("");
  const [resumeLink, setResumeLink] = useState("");

  const [submitting, setSubmitting] = useState(false);

  // --- styles (matched to your previous components) ---
  const pageCls = clsx(
    "min-h-screen w-full px-4 py-6 rounded-xl transition-colors duration-300",
    isDark
      ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
      : "bg-white text-black"
  );
  const cardCls = clsx(
    "max-w-3xl mx-auto rounded-xl p-6 border space-y-5",
    isDark
      ? "bg-black/30 backdrop-blur-md border-[#333] text-neutral-100"
      : "bg-white/80 backdrop-blur-md border-neutral-200 text-neutral-900"
  );

  // --- derived: basic canSubmit guard ---
  const canSubmit = useMemo(() => {
    return (
      !!nice(fullName) &&
      !!nice(studentId) &&
      !!nice(gradDate) &&
      !!nice(email) &&
      !!nice(phone) &&
      !!nice(faculty) &&
      !!nice(major) &&
      !!nice(resumeLink)
    );
  }, [fullName, studentId, gradDate, email, phone, faculty, major, resumeLink]);

  // --- validation helpers ---
  const isValidEmail = (e: string) => /\S+@\S+\.\S+/.test(e);
  const isValidUrl = (u: string) => {
    try {
      // require http/https
      const url = new URL(u);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  };
  const isDigits = (s: string) => /^[0-9]+$/.test(s);

  const resetForm = () => {
    setFullName("");
    setStudentId("");
    setGradDate("");
    setEmail("");
    setPhone("");
    setFaculty("");
    setMajor("");
    setResumeLink("");
  };

  const onSubmit = async () => {
    // client validation
    if (!nice(fullName)) return toast.warning("Full name is required.");
    if (!isDigits(studentId))
      return toast.warning("Student ID must be digits only.");
    if (!gradDate)
      return toast.warning("Expected graduation date is required.");
    if (!isValidEmail(email))
      return toast.warning("Please enter a valid email.");
    if (!isDigits(phone))
      return toast.warning(
        "Phone must contain digits only (e.g., 60123456789)."
      );
    if (!nice(faculty)) return toast.warning("Faculty is required.");
    if (!nice(major)) return toast.warning("Major is required.");
    if (!isValidUrl(resumeLink))
      return toast.warning("Resume link must be a valid URL (http/https).");

    const payload: TApplicationFormData = {
      fullName: nice(fullName),
      studentId: Number(studentId),
      expectedGraduationDate: toISOStartOfDayUTC(gradDate),
      email: nice(email),
      phoneNumber: Number(phone),
      Faculty: nice(faculty),
      Major: nice(major),
      ResumeLink: nice(resumeLink),
    };

    try {
      setSubmitting(true);
      const res = await applyJoinUs(payload);
      if (res?.success) {
        toast.success(
          res?.message || "Application submitted. We’ll be in touch soon!"
        );
        resetForm();
      } else {
        const msg =
          res?.message ||
          (Array.isArray(res?.errors)
            ? res.errors.map((e: any) => e.message).join(", ")
            : "") ||
          "Failed to submit application.";
        toast.error(msg);
      }
    } catch (e: any) {
      toast.error(e?.message || "Failed to submit application.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted) {
    // prevent theme mismatch on first paint
    return <div className="min-h-screen w-full px-4 py-6 opacity-0" />;
  }

  return (
    <div className={pageCls}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Join Us</h1>
        <p className="mt-1">
          Fill in your details and we’ll review your application.
        </p>
      </div>

      <div className={cardCls}>
        {/* Name & Student ID */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="fullName">
              Full Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g., Aro Arko"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="studentId">
              Student ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="studentId"
              inputMode="numeric"
              pattern="[0-9]*"
              value={studentId}
              onChange={(e) =>
                setStudentId(e.target.value.replace(/[^\d]/g, ""))
              }
              placeholder="e.g., 1002265971"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>
        </div>

        {/* Graduation date & Email */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="gradDate">
              Expected Graduation Date <span className="text-red-500">*</span>
            </Label>
            <Input
              id="gradDate"
              type="date"
              value={gradDate}
              onChange={(e) => setGradDate(e.target.value)}
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
            <p className="text-xs opacity-70">
              Format saved as: YYYY-MM-DDT00:00:00.000Z
            </p>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">
              Email <span className="text-red-500">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="arko@example.com"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>
        </div>

        {/* Phone & Faculty */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="phone">
              Phone (digits only) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phone"
              inputMode="numeric"
              pattern="[0-9]*"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/[^\d]/g, ""))}
              placeholder="e.g., 60123456789"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="faculty">
              Faculty <span className="text-red-500">*</span>
            </Label>
            <Input
              id="faculty"
              value={faculty}
              onChange={(e) => setFaculty(e.target.value)}
              placeholder="e.g., ICSDI"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>
        </div>

        {/* Major & Resume */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="major">
              Major <span className="text-red-500">*</span>
            </Label>
            <Input
              id="major"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              placeholder="e.g., Bachelor of Computer Science (Honours)"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="resume">
              Resume Link <span className="text-red-500">*</span>
            </Label>
            <Input
              id="resume"
              value={resumeLink}
              onChange={(e) => setResumeLink(e.target.value)}
              placeholder="https://drive.google.com/file/d/your-file-id/view"
              className={isDark ? "bg-black/40 border-neutral-700" : ""}
            />
            <p className="text-xs opacity-70">Must be a public link.</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={onSubmit}
            disabled={submitting || !canSubmit}
            className={clsx(
              "rounded-md",
              isDark
                ? "bg-white/10 hover:bg-white/20"
                : "bg-neutral-900 hover:bg-neutral-800 text-white"
            )}
          >
            {submitting ? "Submitting…" : "Submit Application"}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={submitting}
            className={isDark ? "border-neutral-700 text-neutral-300" : ""}
          >
            Reset
          </Button>
        </div>

        {/* small note */}
        <p className="text-xs opacity-70">
          By submitting, you agree that we may contact you at the provided
          email/phone about your application.
        </p>
      </div>
    </div>
  );
}
