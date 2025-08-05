"use server";

import { cookies } from "next/headers";

// get all fixed time events
export const getAllFixedTimeEvents = async (query: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/fixed-time-events/all?${query}`,
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
    console.error("Error fetching fixed time events:", error);
    throw new Error("Failed to fetch fixed time events");
  }
};

export const getFixedTimeEventById = async (id: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/fixed-time-events/${id}`,
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
    console.error("Error fetching fixed time event by ID:", error);
    throw new Error("Failed to fetch fixed time event by ID");
  }
};
