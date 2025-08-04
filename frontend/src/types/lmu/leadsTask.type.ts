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
