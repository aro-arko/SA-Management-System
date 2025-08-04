/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

export const getAllDataEntryTasks = async (query: string) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/data-management/all-tasks?${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );
    return res.json();
  } catch (error: any) {
    return error;
  }
};
