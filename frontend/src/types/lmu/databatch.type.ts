export type TLMUDataBatch = {
  _id: string;
  title: string;
  type: string; // 'data-entry'
  assignedSets: number;
  submittedSets: number;
  completedSets: number;
  expectedTotalLeads: number;
  completedLeads: number;
  tasks: string[];
  isActive: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type TCreateDataBatch = {
  title: string;
};
export type TUpdateDataBatch = {
  title: string;
  isActive: boolean;
};
