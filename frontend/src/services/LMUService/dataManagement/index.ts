/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { TCreateDataBatch, TUpdateDataBatch } from "@/types/lmu/databatch.type";
import {
  TCreateDataEntryTask,
  TUpdateDataEntryTask,
} from "@/types/lmu/dataentry.type";
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

// create data batch
export const createDataBatch = async (data: TCreateDataBatch) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/lmu-data-batch/create`,
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

// update data batch
export const updateDataBatch = async (data: TUpdateDataBatch, id: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/lmu-data-batch/update/${id}`,
      {
        method: "PATCH",
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

// create data entry task
export const createDataEntryTask = async (data: TCreateDataEntryTask) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/data-management/create-data-entry-task`,
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

// update data entry task
export const updateDataEntryTask = async (
  data: TUpdateDataEntryTask,
  id: string
) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/data-management/update-data-entry-task/${id}`,
      {
        method: "PATCH",
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
