"use server";

import { TCreateDsmmMultitasking } from "@/types/dsmm/multitasking.type";
import { cookies } from "next/headers";

export const getDSMMMultitaskings = async (query: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/dsmm-multitaskings?${query}`,
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
    console.error("Error fetching DSMM multitaskings:", error);
    throw new Error("Failed to fetch DSMM multitaskings");
  }
};

// get multitasking by id
export const getDSMMMultitaskingById = async (id: string) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/dsmm-multitaskings/${id}`,
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
    console.error("Error fetching DSMM multitasking by ID:", error);
    throw new Error("Failed to fetch DSMM multitasking by ID");
  }
};

// apply for dsmm multitasking
export const applyDSMMMultitasking = async (id: string) => {
  const token = (await cookies()).get("accessToken")?.value;
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/dsmm-multitaskings/apply-multitasking/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
      }
    );

    return await response.json();
  } catch (error) {
    console.error("Error applying for DSMM multitasking:", error);
    throw new Error("Failed to apply for DSMM multitasking");
  }
};

// create dsmm multitasking
export const createDSMMMultitasking = async (data: TCreateDsmmMultitasking) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/dsmm-multitaskings/create`,
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
    console.error("Error creating DSMM multitasking:", error);
    throw new Error("Failed to create DSMM multitasking");
  }
};

// update dsmm multitasking
export const updateDSMMMultitasking = async (
  id: string,
  data: TCreateDsmmMultitasking
) => {
  const token = (await cookies()).get("accessToken")?.value;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/dsmm-multitaskings/update-multitasking/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(data),
      }
    );
    return (await res).json();
  } catch (error) {
    console.error("Error updating DSMM multitasking:", error);
    throw new Error("Failed to update DSMM multitasking");
  }
};
