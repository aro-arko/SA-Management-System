export type TLmuTask = {
  _id: string;
  title: string;
  unit: string;
  type: "whatsapp" | "email" | "calling";
  goalId?: string;
  multiTask: boolean;
  multiTaskId?: string;
  assignedTo: {
    _id: string;
    firstName: string;
    lastName: string;
  };
  createdBy: string;
  dueDate: Date;
  totalLeads: number;
  completedLeads: number;
  remainingLeads: number;
  message: string;
  activities: string[];
  completedAt?: Date;
  status: "in-progress" | "completed";
};

export type TCreateLeadsTask = {
  title: string;
  type: "whatsapp" | "email" | "calling" | string;
  goalId?: string;
  multiTask: boolean;
  multiTaskId?: string;
  totalLeads: number;
  assignedTo: string;
  dueDate: Date | string;
  message: string;
};

export type TUserOption = {
  _id: string;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta?: any;
};

export type TUpdateLeadsTask = {
  title: string;
  assignedTo: string;
  dueDate: Date | string;
  message: string;
};
