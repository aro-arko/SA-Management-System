/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { TCreateLeadsGoal, TUpdateLeadsGoal } from "@/types/lmu/goal.type";
import { TCreateLeadsTask, TUpdateLeadsTask } from "@/types/lmu/leadsTask.type";
import { cookies } from "next/headers";

// -----------------leads goals starts
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

// get leads goal by id
export const getLeadsGoalById = async (id: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/lmu-leads-goals/${id}`,
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

// -----------------leads goals ends

// leads tasks starts

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

// add activity report to leads task
export const addActivityLeadsTask = async (id: string, data: any) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/leads-management/add-activity/${id}`,
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

// create leads tasks
export const createLeadsTask = async (data: TCreateLeadsTask) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/leads-management/create-task`,
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

// update leads tasks
export const updateLeadsTask = async (id: string, data: TUpdateLeadsTask) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/leads-management/update-task/${id}`,
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

// delete leads task
export const deleteLeadsTask = async (id: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/leads-management/delete-task/${id}`,
      {
        method: "DELETE",
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

// create lead goals
export const createLeadGoal = async (data: TCreateLeadsGoal) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/lmu-leads-goals/create`,
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

// update lead goal
export const updateLeadsGoal = async (id: string, data: TUpdateLeadsGoal) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/lmu-leads-goals/update/${id}`,
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
