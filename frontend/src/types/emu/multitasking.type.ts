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
