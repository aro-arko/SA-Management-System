"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserDetailsById } from "@/services/UserService";
import {
  Hash,
  User2,
  Mail,
  Phone,
  Calendar,
  ShieldCheck,
  Users,
  History,
  Clock,
  Pencil,
} from "lucide-react";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import { useUser } from "@/context/UserContext";
import { TUserDetails } from "@/types/users/user.type";

const UserDetails = () => {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useUser();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [thisUser, setThisUser] = useState<TUserDetails | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUserDetailsById(id as string);
      if (res?.data) setThisUser(res.data);
      setLoading(false);
    };
    fetchUser();
  }, [id]);

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
        <Skeleton className="h-10 w-3/4 mx-auto rounded-md mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      </div>
    );

  if (!thisUser) {
    return (
      <div className="text-center py-10 text-red-500 text-lg">
        thisUser not found.
      </div>
    );
  }

  const fullName = `${thisUser.firstName} ${thisUser.lastName}`;
  const infoCards = [
    {
      label: "Full Name",
      value: fullName,
      icon: <User2 className="w-5 h-5 text-blue-400" />,
    },
    {
      label: "Email",
      value: thisUser.email,
      icon: <Mail className="w-5 h-5 text-indigo-400" />,
    },
    {
      label: "Phone",
      value: thisUser.phone,
      icon: <Phone className="w-5 h-5 text-green-400" />,
    },
    {
      label: "Date of Birth",
      value: formatToMalaysiaTime(
        thisUser.dob as unknown as string,
        "dd MMM yyyy"
      ),
      icon: <Calendar className="w-5 h-5 text-yellow-400" />,
    },
    {
      label: "Unit",
      value: thisUser.unit,
      icon: <Users className="w-5 h-5 text-purple-400" />,
    },
    {
      label: "Role",
      value: thisUser.role,
      icon: <ShieldCheck className="w-5 h-5 text-orange-400" />,
    },
    {
      label: "Status",
      value: thisUser.status,
      icon: <Hash className="w-5 h-5 text-red-400" />,
    },
    {
      label: "Created At",
      value: formatToMalaysiaTime(thisUser.createdAt as unknown as string),
      icon: <History className="w-5 h-5 text-gray-400" />,
    },
    {
      label: "Updated At",
      value: formatToMalaysiaTime(thisUser.updatedAt as unknown as string),
      icon: <Clock className="w-5 h-5 text-cyan-400" />,
    },
  ];

  return (
    <div className={`min-h-screen px-6 py-10 ${bgClass}`}>
      <div className="max-w-full mx-auto space-y-10">
        <div className="flex items-center justify-between">
          <div></div>
          <h1 className="text-3xl font-bold capitalize">User Details</h1>
          <button
            onClick={() => router.push(`/${user?.role}/users/${id}/update`)}
            className="flex items-center gap-2 px-4 py-2 text-sm rounded-lg font-semibold border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>

        {/* thisUser Info Cards */}
        <div
          className={`rounded-xl p-6 border ${
            isDark
              ? "bg-black/10 border-neutral-700"
              : "bg-neutral-50 border-neutral-200"
          }`}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {infoCards.map((item, index) => (
              <div
                key={index}
                className="rounded-lg p-4 shadow-sm flex items-start gap-4 border bg-white/80 dark:bg-black/30 border-neutral-200 dark:border-neutral-700"
              >
                <div className="mt-1">{item.icon}</div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="font-medium text-[15px] break-words">
                    {item.value}
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

export default UserDetails;
