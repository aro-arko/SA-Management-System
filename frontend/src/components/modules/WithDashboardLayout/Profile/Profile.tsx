"use client";

import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { getMe } from "@/services/UserService";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  User2,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Users,
  Hash,
  History,
  Clock,
  BadgeCheck,
  Pencil,
  KeyRound,
} from "lucide-react";
import { toast } from "sonner";
import { formatToMalaysiaTime } from "@/utils/formatDate";

type TMe = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  unit: "LMU" | "EMU" | "DSMM" | "HR_FINANCE" | "ALL";
  role:
    | "coordinator"
    | "head"
    | "lmuAdmin"
    | "lmuDataLeader"
    | "lmuMember"
    | "emuAdmin"
    | "emuMember"
    | "dsmmAdmin"
    | "hrFinanceAdmin";
  phone?: string;
  dob?: string | Date;
  status: "active" | "inactive";
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

const Profile = () => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState<TMe | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await getMe();
        if (res?.success) {
          setMe(res.data);
        } else {
          toast.error(res?.message || "Failed to load profile.");
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        toast.error(err?.message || "Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchMe();
  }, []);

  const isDark = resolvedTheme === "dark";
  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  const fullName = useMemo(() => {
    if (!me) return "";
    return `${me.firstName ?? ""} ${me.lastName ?? ""}`.trim();
  }, [me]);

  const initials = useMemo(() => {
    if (!fullName) return "U";
    const parts = fullName.split(" ").filter(Boolean);
    const first = parts[0]?.[0] ?? "";
    const second = parts[1]?.[0] ?? "";
    return (first + second).toUpperCase();
  }, [fullName]);

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black" />;

  if (loading)
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="max-w-full mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-1/3 rounded-md" />
            <div className="flex gap-3">
              <Skeleton className="h-10 w-28 rounded-md" />
              <Skeleton className="h-10 w-40 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-6">
            <Skeleton className="h-[180px] w-[180px] rounded-full" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <Skeleton className="h-4 w-1/4 rounded-md" />
              <Skeleton className="h-4 w-1/5 rounded-md" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );

  if (!me) {
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="text-center text-red-500">Profile not found.</div>
      </div>
    );
  }

  const pill =
    me.status === "active"
      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
      : "bg-gray-100 text-gray-700 dark:bg-gray-800/30 dark:text-gray-300";

  const infoCards = [
    {
      label: "Full Name",
      value: fullName || "N/A",
      icon: <User2 className="w-5 h-5 text-blue-400" />,
    },
    {
      label: "Email",
      value: me.email,
      icon: <Mail className="w-5 h-5 text-indigo-400" />,
    },
    {
      label: "Phone",
      value: me.phone || "N/A",
      icon: <Phone className="w-5 h-5 text-green-500" />,
    },
    {
      label: "Date of Birth",
      value: me.dob
        ? formatToMalaysiaTime(me.dob as unknown as string, "dd MMM yyyy")
        : "N/A",
      icon: <Calendar className="w-5 h-5 text-yellow-400" />,
    },
    {
      label: "Unit",
      value: me.unit,
      icon: <Users className="w-5 h-5 text-purple-400" />,
    },
    {
      label: "Role",
      value: me.role,
      icon: <ShieldCheck className="w-5 h-5 text-orange-400" />,
    },
    {
      label: "Status",
      value: (
        <span
          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${pill}`}
        >
          {me.status}
          {me.status === "active" ? (
            <BadgeCheck className="w-3.5 h-3.5" />
          ) : null}
        </span>
      ),
      icon: <Hash className="w-5 h-5 text-red-400" />,
    },
    {
      label: "Created At",
      value: me.createdAt
        ? formatToMalaysiaTime(me.createdAt as unknown as string)
        : "N/A",
      icon: <History className="w-5 h-5 text-gray-400" />,
    },
    {
      label: "Updated At",
      value: me.updatedAt
        ? formatToMalaysiaTime(me.updatedAt as unknown as string)
        : "N/A",
      icon: <Clock className="w-5 h-5 text-cyan-400" />,
    },
  ];

  return (
    <div className={`min-h-screen px-4 py-10 sm:px-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        {/* Header + Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            My Profile
          </h1>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="flex items-center gap-2 border-neutral-300 dark:border-neutral-700"
              onClick={() => router.push(`/${me.role}/profile/edit`)}
            >
              <Pencil className="w-4 h-4" />
              Edit Profile
            </Button>
            <Button
              className="flex items-center gap-2"
              onClick={() => router.push(`/${me.role}/change-password`)}
            >
              <KeyRound className="w-4 h-4" />
              Change Password
            </Button>
          </div>
        </div>

        {/* Top Card: Avatar + Basic Info */}
        <div
          className={`rounded-xl p-6 border shadow-xl backdrop-blur-lg ${
            isDark
              ? "bg-black/20 border-neutral-700"
              : "bg-white/80 border-neutral-200"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-6 items-center">
            {/* Avatar */}
            <div className="flex items-center justify-center">
              <div
                className="h-[140px] w-[140px] sm:h-[180px] sm:w-[180px] rounded-full flex items-center justify-center text-4xl sm:text-5xl font-bold shadow-md border border-neutral-200 dark:border-neutral-700
                bg-gradient-to-br from-white/60 to-white/30 dark:from-white/10 dark:to-white/5
              "
              >
                {initials}
              </div>
            </div>

            {/* Name / Email / Role */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <User2 className="w-6 h-6 text-blue-400" />
                <p className="text-2xl font-semibold">{fullName}</p>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <p className="text-sm break-all">{me.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-orange-400" />
                <p className="text-sm capitalize">{me.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div
          className={`rounded-xl p-6 border ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {infoCards.map((item, idx) => (
              <div
                key={idx}
                className="rounded-lg p-4 shadow-sm flex items-start gap-4 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700"
              >
                <div className="mt-1">{item.icon}</div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-[15px] break-words">
                    {typeof item.value === "string" ? item.value : item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
