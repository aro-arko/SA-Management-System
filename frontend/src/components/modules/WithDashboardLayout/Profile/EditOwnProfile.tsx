"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { getMe, updateOwnProfile } from "@/services/UserService";
import {
  Mail,
  ShieldCheck,
  Users,
  User2,
  Phone,
  Calendar,
  Save,
} from "lucide-react";

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
};

type TUpdateOwnProfile = {
  firstName: string;
  lastName: string;
  phone: string;
  dob: string; // ISO date string
};

const EditOwnProfile = () => {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [me, setMe] = useState<TMe | null>(null);
  const [form, setForm] = useState<TUpdateOwnProfile>({
    firstName: "",
    lastName: "",
    phone: "",
    dob: "",
  });

  useEffect(() => setMounted(true), []);

  // Load current user
  useEffect(() => {
    const run = async () => {
      try {
        const res = await getMe();
        if (res?.success && res?.data) {
          setMe(res.data);
          setForm({
            firstName: res.data.firstName ?? "",
            lastName: res.data.lastName ?? "",
            phone: res.data.phone ?? "",
            dob: res.data.dob
              ? typeof res.data.dob === "string"
                ? res.data.dob.slice(0, 10)
                : new Date(res.data.dob).toISOString().slice(0, 10)
              : "",
          });
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
    run();
  }, []);

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

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateOwnProfile(form);
      if (res?.success) {
        toast.success("Profile updated successfully.");
        router.push(`/${me?.role.toLocaleLowerCase()}/profile`);
      } else {
        const backendMsg =
          res?.message ||
          res?.error?.message ||
          res?.error?.datail?.message ||
          "Failed to update profile.";
        toast.error(backendMsg);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error(err?.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const isDark = resolvedTheme === "dark";
  const bgClass = !mounted
    ? "bg-transparent"
    : isDark
    ? "bg-gradient-to-b from-[#000000] to-[#170303] text-white"
    : "bg-white text-black";

  if (!mounted) return <div className="min-h-screen bg-white dark:bg-black" />;

  if (loading)
    return (
      <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
        <div className="max-w-full mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <Skeleton className="h-10 w-48 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-6">
            <Skeleton className="h-[180px] w-[180px] rounded-full" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-1/3 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <Skeleton className="h-4 w-1/4 rounded-md" />
            </div>
          </div>
          <Skeleton className="h-[340px] rounded-xl" />
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

  return (
    <div className={`min-h-screen px-4 py-10 sm:px-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Edit My Profile
          </h1>
          <Button
            variant="outline"
            className="border-neutral-300 dark:border-neutral-700"
            onClick={() => router.push(`/${me.role}/profile`)}
          >
            Cancel
          </Button>
        </div>

        {/* Top Card: Avatar + Locked fields (email/unit/role) */}
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
                bg-gradient-to-br from-white/60 to-white/30 dark:from-white/10 dark:to-white/5"
              >
                {initials}
              </div>
            </div>

            {/* Non-editable summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-400" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm break-all">{me.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Unit</p>
                  <p className="text-sm">{me.unit}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-orange-400" />
                <div>
                  <p className="text-xs text-muted-foreground">Role</p>
                  <p className="text-sm capitalize">{me.role}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Editable Form */}
        <form
          onSubmit={onSubmit}
          className={`rounded-xl p-6 border space-y-6 ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div>
              <Label className="flex items-center gap-2 mb-2">
                <User2 className="w-4 h-4 text-blue-400" /> First Name
              </Label>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={onChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <User2 className="w-4 h-4 text-blue-400" /> Last Name
              </Label>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={onChange}
                className="mt-1"
                required
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Phone className="w-4 h-4 text-green-500" /> Phone
              </Label>
              <Input
                name="phone"
                value={form.phone ?? ""}
                onChange={onChange}
                className="mt-1"
              />
            </div>

            <div>
              <Label className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-yellow-400" /> Date of Birth
              </Label>
              <Input
                name="dob"
                type="date"
                value={form.dob ?? ""}
                onChange={onChange}
                className="mt-1"
              />
            </div>
          </div>

          <Button type="submit" className="w-full sm:w-auto" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default EditOwnProfile;
