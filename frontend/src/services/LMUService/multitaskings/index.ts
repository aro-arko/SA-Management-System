"use server";

import { cookies } from "next/headers";

export const getAllMultitaskings = async (query: string) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/lmu-multitaskings?${query}`,
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
    console.error("Error fetching multitaskings:", error);
    throw error;
  }
};
