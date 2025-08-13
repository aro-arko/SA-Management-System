import UpdateDsmmMultitasking from "@/components/modules/WithDashboardLayout/DSMM Unit/Multitaskings/UpdateDsmmMultitasking";
import {
  getDSMMMultitaskingById,
  updateDSMMMultitasking,
} from "@/services/DSMMService/multitasking";

type CreateResult = { ok: boolean; message?: string; redirectTo?: string };

const MSIA_TZ = "Asia/Kuala_Lumpur";

// helpers to format to Malaysia local date/time strings for inputs
function toMsiaParts(isoLike: string) {
  const d = new Date(isoLike);
  const dateYMD = new Intl.DateTimeFormat("en-CA", {
    timeZone: MSIA_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d); // yyyy-mm-dd

  const timeHHmm = new Intl.DateTimeFormat("en-GB", {
    timeZone: MSIA_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d); // HH:mm

  return { dateYMD, timeHHmm };
}

// build ISO strings pinned to Malaysia time
function msiaISO(dateYMD: string, hhmm: string) {
  return `${dateYMD}T${hhmm}:00+08:00`;
}
function msiaDateStartISO(dateYMD: string) {
  return `${dateYMD}T00:00:00+08:00`;
}

export default async function Page({ params }: { params: { id: string } }) {
  const id = params.id;

  // 1) fetch existing data
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

  // 2) prefill values in Malaysia time
  const { dateYMD: taskDateYMD } = toMsiaParts(task.taskDate);
  const { timeHHmm: startHHmm } = toMsiaParts(task.startTime);
  const { timeHHmm: endHHmm } = toMsiaParts(task.endTime);

  // 3) server action to submit updates
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
