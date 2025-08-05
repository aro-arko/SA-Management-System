"use server";

import { cookies } from "next/headers";

export const getHRFinanceTasks = async (query: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/hr-finance-tasks/all-tasks?${query}`,
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
    console.error("Error fetching HR Finance tasks:", error);
    throw new Error("Failed to fetch HR Finance tasks");
  }
};
