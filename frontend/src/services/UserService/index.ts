/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { TUserDetails } from "@/types/users/user.type";
import { cookies } from "next/headers";

export const getUserNameById = async (userId: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch user data");
    }

    return res.json();
  } catch (error: any) {
    return error.message || "An error occurred while fetching user data";
  }
};

export const TaskDetails = async (taskId: string) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/tasks/${taskId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch task details");
    }

    return res.json();
  } catch (error: any) {
    return error.message || "An error occurred while fetching task details";
  }
};

export const getAllUsers = async (query: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users?${query}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch users");
    }

    return res.json();
  } catch (error: any) {
    return error.message || "An error occurred while fetching users";
  }
};

// get user details by Id
export const getUserDetailsById = async (userId: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/details/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch user details");
    }

    return res.json();
  } catch (error: any) {
    return error.message || "An error occurred while fetching user details";
  }
};

// edit user details
export const editUserDetails = async (id: string, data: TUserDetails) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/users/update/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({ body: data }),
      }
    );
    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};
