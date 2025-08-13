"use server";

import { TCreateDsmmTask } from "@/types/dsmm/task.type";
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

// get DSMMTask by ID
export const getDSMMTaskById = async (taskId: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/dsmmtask/${taskId}`,
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
    console.error("Error fetching DSMM task by ID:", error);
    throw new Error("Failed to fetch DSMM task by ID");
  }
};

// create dsmm task
export const createDsmmTask = async (data: TCreateDsmmTask) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/dsmmtask/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error creating DSMM task:", error);
    throw new Error("Failed to create DSMM task");
  }
};

// export const delete dsmm task
export const deleteDsmmTask = async (id: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/dsmmtask/delete/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error deleting DSMM task:", error);
    throw new Error("Failed to delete DSMM task");
  }
};

// update dsmm task
export const updateDsmmTask = async (id: string, data: TCreateDsmmTask) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/dsmmtask/update/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(data),
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error updating DSMM task:", error);
    throw new Error("Failed to update DSMM task");
  }
};
