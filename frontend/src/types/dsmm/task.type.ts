export type TDSMMTask = {
  _id: string;
  title: string;
  unit: string;
  type: string;
  details: string;
  multiTask: boolean;
  multiTaskId: string;
  taskDate: Date;
  startTime: Date;
  endTime: Date;
  selectedManpower: string[];
  createdBy?: string;
  status: "completed" | "in-progress";
  createdAt: Date;
  updatedAt: Date;
};
