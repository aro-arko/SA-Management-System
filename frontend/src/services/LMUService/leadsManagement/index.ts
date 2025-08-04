/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

export const leadsGoals = async (query: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/lmu-leads-goals/all?${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );
    // console.log(res);
    return res.json();
  } catch (error: any) {
    return error;
  }
};

export const leadsTasks = async (query: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  // console.log(query);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/leads-management/all-tasks?${query}`,
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
