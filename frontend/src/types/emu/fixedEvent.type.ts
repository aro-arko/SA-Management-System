export type TFixedTimeEvent = {
  _id: string;
  title: string;
  type: string;
  multiTask: boolean;
  multiTaskId?: string;
  eventDate: Date;
  createdBy: string;
  selectedManpower: string[];
  startTime: string;
  endTime: string;
  signInData: string;
  signOutData: string;
  status: "completed" | "in-progress";
  createdAt: Date;
  updatedAt: Date;
};

export type TCreateEventTask = {
  title: string;
  multiTask: boolean;
  multiTaskId?: string;
  eventDate: Date | string;
  startTime: string;
  endTime: string;
};
