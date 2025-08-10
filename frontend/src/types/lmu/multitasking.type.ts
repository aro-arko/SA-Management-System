export type TLMUMultitasking = {
  _id: string;
  title: string;
  type: "whatsapp" | "calling" | "email" | "data-entry" | "others";
  manpower: {
    userId: string;
  }[];

  createdBy: string;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
};

export type TCreateLMUMultitasking = {
  title: string;
  type: "whatsapp" | "calling" | "email" | "data-entry" | "others";
};
