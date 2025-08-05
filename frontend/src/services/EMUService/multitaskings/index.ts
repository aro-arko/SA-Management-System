"use server";

import { cookies } from "next/headers";

export const getEmuMultitaskings = async (query: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/emu-multitaskings?${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error fetching EMU multitaskings:", error);
    throw new Error("Failed to fetch EMU multitaskings");
  }
};

// get emu multitasking by id
export const getEmuMultitaskingById = async (id: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/emu-multitaskings/${id}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error fetching EMU multitasking by ID:", error);
    throw new Error("Failed to fetch EMU multitasking by ID");
  }
};
