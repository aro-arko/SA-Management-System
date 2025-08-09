/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { cookies } from "next/headers";

// get all data entry tasks with pagination
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

// get all data batches
export const getAllDataBatches = async (query: string) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/lmu-data-batch/all?${query}`,
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

// get data batch by ID
export const getDataBatchById = async (id: string) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/lmu-data-batch/${id}`,
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

// submit data report
export const submitDataReport = async (id: string, data: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/data-management/submit-report/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    return res.json();
  } catch (error: any) {
    return error;
  }
};

// edit data entry report
export const editDataEntryReport = async (id: string, data: any) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/data-management/edit-report/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    return response.json();
  } catch (error: any) {
    return error;
  }
};
