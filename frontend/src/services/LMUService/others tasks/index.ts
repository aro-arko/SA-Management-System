"use server";

import { cookies } from "next/headers";

export const getLMUOtherTasks = async (query: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/lmu-others/all?${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Error fetching others tasks:", error);
    throw new Error("Failed to fetch others tasks");
  }
};
