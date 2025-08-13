export type TEMUMultitasking = {
  _id: string;
  title: string;
  manpower: {
    userId: string;
  }[];
  eventDate: Date;
  startTime: Date;
  endTime: Date;
  createdBy: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
};

export type TCreateEMUMultitasking = {
  title: string;
  eventDate: Date | string;
  startTime: Date | string;
  endTime: Date | string;
};

export type TUpdateEmuMultitasking = {
  _id: string;
  title: string;
  eventDate: Date | string;
  startTime: Date | string;
  endTime: Date | string;
  status: "active" | "inactive";
};
