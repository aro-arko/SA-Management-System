export type TLmuGoal = {
  _id: string;
  title: string;
  type: "whatsapp" | "email" | "calling";
  completed: number;
  remaining: number;
  total: number;
  tasks: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
};

export type TCreateLeadsGoal = {
  title: string;
  type: "whatsapp" | "email" | "calling";
};
export type TUpdateLeadsGoal = {
  title: string;
  type: "whatsapp" | "email" | "calling";
  isActive: boolean;
};
