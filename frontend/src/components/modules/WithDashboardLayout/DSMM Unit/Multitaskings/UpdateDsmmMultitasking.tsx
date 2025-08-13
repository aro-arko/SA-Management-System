"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useFormState, useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import clsx from "clsx";

type CreateResult = { ok: boolean; message?: string; redirectTo?: string };
type ActionType = (
  prev: CreateResult | undefined,
  formData: FormData
) => Promise<CreateResult>;

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className={clsx(
        "rounded-md",
        "bg-neutral-900 hover:bg-neutral-800 text-white",
        "dark:bg-white/10 dark:hover:bg-white/20"
      )}
    >
      {pending ? "Saving…" : "Save Changes"}
    </Button>
  );
}

export default function UpdateDsmmMultitasking({
  action,
  initial,
}: {
  action: ActionType;
  initial: {
    id: string;
    title: string;
    taskDateYMD: string; // yyyy-mm-dd
    startHHmm: string; // HH:mm
    endHHmm: string; // HH:mm
  };
}) {
  const router = useRouter();
  const [state, formAction] = useFormState<CreateResult, FormData>(action, {
    ok: true,
  });

  useEffect(() => {
    if (!state) return;
    if (state.ok && state.redirectTo) {
      toast.success(state.message || "Updated.");
      const t = setTimeout(() => router.push(state.redirectTo!), 60);
      return () => clearTimeout(t);
    }
    if (
      state.ok === false &&
      state.message &&
      state.message !== "NEXT_REDIRECT"
    ) {
      toast.error(state.message);
    }
  }, [state, router]);

  return (
    <div
      className={clsx(
        "min-h-screen w-full px-4 py-6 rounded-xl transition-colors",
        "bg-white text-black",
        "dark:bg-gradient-to-b dark:from-[#000000] dark:to-[#170303] dark:text-white"
      )}
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Update DSMM Multitasking
        </h1>
        <p className="mt-1">Edit the title, date, and times, then save.</p>
      </div>

      <form
        action={formAction}
        className={clsx(
          "max-w-3xl mx-auto rounded-xl p-6 border space-y-5",
          "bg-white/80 border-neutral-200 text-neutral-900",
          "dark:bg-black/30 dark:border-[#333] dark:text-neutral-100"
        )}
      >
        {/* Title */}
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            required
            defaultValue={initial.title}
            placeholder="e.g., DSMM Campaign Preparation"
            className="dark:bg-black/40 dark:border-neutral-700"
          />
        </div>

        {/* Date */}
        <div className="grid gap-2">
          <Label htmlFor="taskDate">Task Date</Label>
          <Input
            id="taskDate"
            name="taskDate"
            type="date"
            required
            defaultValue={initial.taskDateYMD}
            className="dark:bg-black/40 dark:border-neutral-700"
          />
          <p className="text-xs opacity-70">
            We’ll combine this date with your start/end times.
          </p>
        </div>

        {/* Time range */}
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="startTime">Start Time</Label>
            <Input
              id="startTime"
              name="startTime"
              type="time"
              required
              defaultValue={initial.startHHmm}
              className="dark:bg-black/40 dark:border-neutral-700"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="endTime">End Time</Label>
            <Input
              id="endTime"
              name="endTime"
              type="time"
              required
              defaultValue={initial.endHHmm}
              className="dark:bg-black/40 dark:border-neutral-700"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <SubmitButton />
          <Button
            type="button"
            variant="outline"
            className="dark:border-neutral-700 dark:text-neutral-300"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
