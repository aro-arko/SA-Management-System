"use server";

import { TCreateHrFinanceTask } from "@/types/hr_finance/task.types";
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

// get hr finance task by id
export const getHRFinanceTaskById = async (id: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/hr-finance-tasks/${id}`,
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
    console.error("Error fetching HR Finance task by ID:", error);
    throw new Error("Failed to fetch HR Finance task by ID");
  }
};

// create hr task
export const createHRFinanceTask = async (data: TCreateHrFinanceTask) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/hr-finance-tasks/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    return (await res).json();
  } catch (error) {
    console.error("Error creating HR Finance task:", error);
    throw new Error("Failed to create HR Finance task");
  }
};

// delete hr task
export const deleteHRFinanceTask = async (id: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/hr-finance-tasks/delete-task/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    return (await res).json();
  } catch (error) {
    console.error("Error deleting HR Finance task:", error);
    throw new Error("Failed to delete HR Finance task");
  }
};
