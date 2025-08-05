"use server";

import { cookies } from "next/headers";

export const getDSMMTasks = async (query: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/dsmmtask/all?${query}`,
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
    console.error("Error fetching DSMM tasks:", error);
    throw new Error("Failed to fetch DSMM tasks");
  }
};
