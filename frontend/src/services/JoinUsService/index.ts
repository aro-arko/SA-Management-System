"use server";

import { TApplicationFormData } from "@/types/hr_finance/newapplication.type";

export const applyJoinUs = async (data: TApplicationFormData) => {
  try {
    const res = fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/new-applications/apply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return (await res).json();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error applying to join us:", error);
  }
};
