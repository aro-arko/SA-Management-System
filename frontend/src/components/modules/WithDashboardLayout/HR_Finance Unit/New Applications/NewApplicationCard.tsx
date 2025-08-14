/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label as UILabel } from "@/components/ui/label";
import {
  User,
  Calendar,
  Mail,
  Phone,
  GraduationCap,
  ClipboardSignature,
  CheckCircle2,
} from "lucide-react";
import { formatToMalaysiaTime } from "@/utils/formatDate";
import clsx from "clsx";
import { TNewApplication } from "@/types/hr_finance/newapplication.type";
import { useUser } from "@/context/UserContext";
import { useMemo, useState, useTransition } from "react";
import { toast } from "sonner";
import { updateApplicationStatus } from "@/services/HR_FinanceService/New Application";

type Props = {
  application: TNewApplication;
  onToggleChecked?: (id: string | undefined, checked: boolean) => void;
  onChangeStatus?: (
    id: string | undefined,
    next: "Reviewed" | "Pending"
  ) => void;
};

const NewApplicationCard = ({
  application,
  onToggleChecked,
  onChangeStatus,
}: Props) => {
  const { user } = useUser();
  const isHRAdmin = (user?.role || "").toLowerCase() === "hrfinanceadmin";

  const {
    _id,
    fullName,
    studentId,
    email,
    phoneNumber,
    Faculty,
    Major,
    ResumeLink,
    expectedGraduationDate,
    createdAt,
    isChecked,
  } = application as any;

  const [checked, setChecked] = useState<boolean>(!!isChecked);
  const [isPending, startTransition] = useTransition();

  const statusText = useMemo(
    () => (checked ? "Reviewed" : "Pending"),
    [checked]
  );

  const statusColor = checked
    ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";

  const handleToggle = (next: boolean) => {
    // optimistic update
    const prev = checked;
    setChecked(next);

    startTransition(async () => {
      try {
        const res = await updateApplicationStatus(String(_id), {
          isChecked: next,
        });
        if (!res?.success)
          throw new Error(res?.message || "Failed to update status");

        // optional callbacks for parent
        onToggleChecked?.(_id, next);
        onChangeStatus?.(_id, next ? "Reviewed" : "Pending");

        toast.success(next ? "Marked as reviewed." : "Marked as pending.");
      } catch (err: any) {
        // rollback on error
        setChecked(prev);
        toast.error(err?.message || "Failed to update status.");
      }
    });
  };

  return (
    <Card className="w-full border rounded-lg bg-white/80 dark:bg-black/30 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="px-4 py-4 text-[15px] space-y-3">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="font-bold text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-blue-500" />
            {fullName}
          </div>

          <div className="flex items-center gap-3">
            <span
              className={clsx(
                "text-sm px-3 py-1 rounded-full font-medium whitespace-nowrap",
                statusColor
              )}
            >
              {statusText}
            </span>

            {isHRAdmin && (
              <div className="flex items-center gap-2">
                <Switch
                  id={`reviewed-${_id ?? "app"}`}
                  checked={checked}
                  onCheckedChange={handleToggle}
                  disabled={isPending}
                />
                <UILabel
                  htmlFor={`reviewed-${_id ?? "app"}`}
                  className="text-sm"
                >
                  {isPending ? "Saving…" : "Mark as reviewed"}
                </UILabel>
              </div>
            )}
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <InfoItem
            icon={<ClipboardSignature />}
            label="Student ID"
            value={studentId}
          />
          <InfoItem icon={<Mail />} label="Email" value={email} />
          <InfoItem icon={<Phone />} label="Phone" value={`+${phoneNumber}`} />
          <InfoItem icon={<GraduationCap />} label="Faculty" value={Faculty} />
          <InfoItem icon={<GraduationCap />} label="Major" value={Major} />
          <InfoItem
            icon={<Calendar />}
            label="Graduation"
            value={formatToMalaysiaTime(
              expectedGraduationDate as unknown as string,
              "dd MMM yyyy"
            )}
          />
          <InfoItem
            icon={<Calendar />}
            label="Submitted At"
            value={formatToMalaysiaTime(createdAt as unknown as string)}
          />
          <InfoItem
            icon={<CheckCircle2 />}
            label="Resume"
            value={
              <a
                href={ResumeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline hover:text-blue-800 dark:text-blue-400"
              >
                View
              </a>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex items-start gap-2">
    <div className="mt-1 text-blue-400">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-medium text-[15px]">{value}</p>
    </div>
  </div>
);

export default NewApplicationCard;
