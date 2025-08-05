export type TDSMMMultitasking = {
  _id: string;
  title: string;
  manpower: {
    userId: string;
  }[];
  taskDate: Date;
  startTime: Date;
  endTime: Date;
  createdBy: string;
  status: "active" | "inactive";
  createdAt: Date;
  updatedAt: Date;
};
