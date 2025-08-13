import CreateEmuMultitasking from "@/components/modules/WithDashboardLayout/Event Management Unit/Multitaskings/CreateEmuMultitasking";
import { createEmuMultitasking } from "@/services/EMUService/multitaskings";

// app/emuadmin/emu-multitaskings/create/page.tsx
type CreateResult = { ok: boolean; message?: string; redirectTo?: string };

async function handleCreate(
  _prev: CreateResult | undefined,
  formData: FormData
): Promise<CreateResult> {
  "use server";

  const title = String(formData.get("title") || "").trim();
  const eventDate = String(formData.get("eventDate") || "").trim();
  const startTime = String(formData.get("startTime") || "").trim();
  const endTime = String(formData.get("endTime") || "").trim();

  if (!title) return { ok: false, message: "Title is required." };
  if (!eventDate) return { ok: false, message: "Event date is required." };
  if (!startTime) return { ok: false, message: "Start time is required." };
  if (!endTime) return { ok: false, message: "End time is required." };

  const stitch = (d: string, t: string) => `${d}T${t}:00`;
  const payload = {
    title,
    eventDate: stitch(eventDate, startTime),
    startTime: stitch(eventDate, startTime),
    endTime: stitch(eventDate, endTime),
  };

  try {
    const res = await createEmuMultitasking(payload);
    if (res?.success) {
      return {
        ok: true,
        message: res?.message || "Successfully created EMU multitasking.",
        redirectTo: "/emuadmin/emu-multitaskings",
      };
    }
    return {
      ok: false,
      message: res?.message || "Failed to create EMU multitasking.",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { ok: false, message: e?.message || "Something went wrong." };
  }
}

export default function Page() {
  return <CreateEmuMultitasking action={handleCreate} />;
}
