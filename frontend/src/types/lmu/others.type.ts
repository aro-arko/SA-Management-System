export type TLMUOthersTask = {
  _id: string;
  title: string;
  unit: string;
  type: string;
  details: string;
  multiTask: boolean;
  multiTaskId: string;
  assignedTo: string[];
  status: "in-progress" | "completed";
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type TCreateLMUOthersTask = {
  title: string;
  details: string;
  multiTask: boolean;
  multiTaskId?: string;
  assignedTo: string[];
};

export type TUpdateLMUOthersTask = {
  title?: string;
  details?: string;
  multiTask?: boolean;
  multiTaskId?: string;
  assignedTo?: string[];
  status?: "in-progress" | "completed";
};
