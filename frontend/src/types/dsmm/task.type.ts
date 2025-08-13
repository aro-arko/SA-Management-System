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

export type TCreateDsmmTask = {
  title: string;
  details: string;
  multiTask: boolean;
  multiTaskId?: string;
  taskDate: Date | string;
  startTime: Date | string;
  endTime: Date | string;
  selectedManpower: string[];
  createdBy?: string;
  status: "completed" | "in-progress";
};
