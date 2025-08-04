export type TActivity = {
  completedLeads: string;
  flaggedLeads: string;
  remarks: string;
};

export type TLeadsTask = {
  title: string;
  unit: string;
  type: "whatsapp" | "email" | "calling";
  goalId?: string;
  multiTask: boolean;
  multiTaskId?: string;
  assignedTo: string;
  createdBy: string;
  dueDate: Date;
  totalLeads: number;
  completedLeads: number;
  remainingLeads: number;
  message: string;
  activities: TActivity[];
  completedAt?: Date;
  status: "in-progress" | "completed";
};
