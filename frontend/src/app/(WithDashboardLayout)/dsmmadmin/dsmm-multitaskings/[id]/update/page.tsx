import UpdateDsmmMultitasking from "@/components/modules/WithDashboardLayout/DSMM Unit/Multitaskings/UpdateDsmmMultitasking";
import {
  getDSMMMultitaskingById,
  updateDSMMMultitasking,
} from "@/services/DSMMService/multitasking";

type CreateResult = { ok: boolean; message?: string; redirectTo?: string };

const MSIA_TZ = "Asia/Kuala_Lumpur";

function toMsiaParts(isoLike: string) {
  const d = new Date(isoLike);
  const dateYMD = new Intl.DateTimeFormat("en-CA", {
    timeZone: MSIA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
  const timeHHmm = new Intl.DateTimeFormat("en-GB", {
    timeZone: MSIA_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
  return { dateYMD, timeHHmm };
}

function msiaISO(dateYMD: string, hhmm: string) {
  return `${dateYMD}T${hhmm}:00+08:00`;
}
function msiaDateStartISO(dateYMD: string) {
  return `${dateYMD}T00:00:00+08:00`;
}

// 👇 Accept Promise for `params` to satisfy Next's generated PageProps
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // ✅ await the promise

  const res = await getDSMMMultitaskingById(id);
  if (!res?.success || !res?.data) {
    return (
      <div className="p-6">
        <p className="text-red-500">Multitasking not found.</p>
      </div>
    );
  }

  const task = res.data as {
    _id: string;
    title: string;
    taskDate: string;
    startTime: string;
    endTime: string;
  };

  const { dateYMD: taskDateYMD } = toMsiaParts(task.taskDate);
  const { timeHHmm: startHHmm } = toMsiaParts(task.startTime);
  const { timeHHmm: endHHmm } = toMsiaParts(task.endTime);

  async function action(
    _prev: CreateResult | undefined,
    formData: FormData
  ): Promise<CreateResult> {
    "use server";
    try {
      const title = String(formData.get("title") || "").trim();
      const taskDate = String(formData.get("taskDate") || "");
      const startTime = String(formData.get("startTime") || "");
      const endTime = String(formData.get("endTime") || "");
      if (!title || title.length < 3) {
        return { ok: false, message: "Title must be at least 3 characters." };
      }
      if (!taskDate || !startTime || !endTime) {
        return {
          ok: false,
          message: "Please provide date, start time, and end time.",
        };
      }
      const startISO = msiaISO(taskDate, startTime);
      const endISO = msiaISO(taskDate, endTime);
      if (new Date(endISO).getTime() <= new Date(startISO).getTime()) {
        return { ok: false, message: "End time must be after start time." };
      }
      const payload = {
        title,
        taskDate: msiaDateStartISO(taskDate),
        startTime: startISO,
        endTime: endISO,
      };
      const updateRes = await updateDSMMMultitasking(id, payload);
      if (!updateRes?.success) {
        return {
          ok: false,
          message: updateRes?.message || "Failed to update multitasking.",
        };
      }
      return {
        ok: true,
        message: "DSMM multitasking updated.",
        redirectTo: `/dsmmadmin/dsmm-multitaskings/${id}`,
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      return { ok: false, message: e?.message || "Something went wrong." };
    }
  }

  return (
    <UpdateDsmmMultitasking
      action={action}
      initial={{
        id,
        title: task.title || "",
        taskDateYMD,
        startHHmm,
        endHHmm,
      }}
    />
  );
}
