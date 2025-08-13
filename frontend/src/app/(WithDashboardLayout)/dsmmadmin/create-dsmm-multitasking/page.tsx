import CreateDsmmMultitasking from "@/components/modules/WithDashboardLayout/DSMM Unit/Multitaskings/CreateDsmmMultitasking";
import { createDSMMMultitasking } from "@/services/DSMMService/multitasking";

type CreateResult = { ok: boolean; message?: string; redirectTo?: string };

/** Build ISO strings pinned to Malaysia time (+08:00) */
function msiaISO(dateYMD: string, hhmm: string) {
  // hhmm like "09:00"
  return `${dateYMD}T${hhmm}:00+08:00`;
}
function msiaDateStartISO(dateYMD: string) {
  return `${dateYMD}T00:00:00+08:00`;
}

export default function Page() {
  async function action(
    _prevState: CreateResult | undefined,
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
      const res = await createDSMMMultitasking(payload);

      if (!res?.success) {
        return {
          ok: false,
          message: res?.message || "Failed to create multitasking.",
        };
      }

      return {
        ok: true,
        message: "DSMM multitasking created.",
        redirectTo: "/dsmmadmin/dsmm-multitaskings",
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      return { ok: false, message: e?.message || "Something went wrong." };
    }
  }

  return <CreateDsmmMultitasking action={action} />;
}
