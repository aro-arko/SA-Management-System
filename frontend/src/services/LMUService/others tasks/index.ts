"use server";

import {
  TCreateLMUOthersTask,
  TUpdateLMUOthersTask,
} from "@/types/lmu/others.type";
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

// create other task
export const createLMUOtherTask = async (data: TCreateLMUOthersTask) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/lmu-others/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Error creating others task:", error);
    throw new Error("Failed to create others task");
  }
};

// update other task
export const updateLMUOtherTask = async (
  data: TUpdateLMUOthersTask,
  id: string
) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/lmu-others/update/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    return await res.json();
  } catch (error) {
    console.error("Error updating others task:", error);
    throw new Error("Failed to update others task");
  }
};
