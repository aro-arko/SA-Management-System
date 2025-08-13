export type THRFinanceTask = {
  _id: string;
  title: string;
  unit: string;
  type: string;
  details: string;
  assignedTo: string;
  dueDate: Date;
  createdBy: string;
  status: "in-progress" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
};

export type TCreateHrFinanceTask = {
  title: string;
  details: string;
  assignedTo: string;
  dueDate: string | Date;
};

export type TUpdateHrFinanceTask = {
  title?: string;
  details?: string;
  assignedTo?: string;
  dueDate?: string | Date;
  status?: "in-progress" | "completed";
};
