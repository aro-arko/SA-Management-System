"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TUserDetails } from "@/types/users/user.type";
import { User, BadgeInfo, BadgeCheck } from "lucide-react";
import { getUserNameById } from "@/services/UserService";

const UserCard = ({ user }: { user: TUserDetails }) => {
  const [name, setName] = useState<string>("Loading...");

  useEffect(() => {
    const fetchName = async () => {
      try {
        const res = await getUserNameById(user._id);
        setName(res?.data?.name || "Unknown");
      } catch {
        setName("Unknown");
      }
    };

    fetchName();
  }, [user._id]);

  return (
    <Card className="w-full border rounded-lg bg-white/80 dark:bg-black/30 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-4 px-4 py-3 text-[15px] text-muted-foreground">
        {/* Name: span 2 cols on md screens */}
        <div className="flex items-center gap-2 truncate col-span-1 md:col-span-2">
          <User className="w-5 h-5 text-blue-600 shrink-0" />
          <span className="text-sm text-gray-400 dark:text-gray-400">
            Name:
          </span>
          <span className="font-medium text-foreground ml-1 truncate">
            {name}
          </span>
        </div>

        {/* Unit */}
        <div className="flex items-center gap-2 truncate">
          <BadgeInfo className="w-5 h-5 text-purple-600 shrink-0" />
          <span className="text-sm text-gray-400 dark:text-gray-400">
            Unit:
          </span>
          <span className="font-medium text-foreground ml-1 truncate">
            {user.unit || "N/A"}
          </span>
        </div>

        {/* Status */}
        <div className="flex items-center justify-end gap-2">
          <span className="text-sm text-gray-400 dark:text-gray-400">
            Status:
          </span>
          <span className="font-medium text-foreground capitalize">
            {user.status || "unknown"}
          </span>
          {user.status === "active" && (
            <BadgeCheck className="w-4 h-4 text-green-500" />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
