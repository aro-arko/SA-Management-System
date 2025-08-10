export type TDataEntryReport = {
  completedLeads: number;
  flaggedLeads?: number;
  fileLink?: string;
  remarks?: string;
};

export type TDataEntryTask = {
  _id: string;
  title: string;
  unit: string;
  type: "data-entry";
  batchId?: string;
  multiTask: boolean;
  multiTaskId?: string;
  assignedTo: string;
  createdBy: string;
  dueDate: Date;
  schoolTeamTotalLeads: number;
  campaignId: string; // GZXCMB
  highestQualification: string; // SPM
  preferredProgram: string; // FDBAA
  preferredIntake: string; // Jan 2024
  schoolLevel: string; // Form 5
  schoolName: string;
  totalLeads: number;
  missingOrExtraLeads?: number;
  message: string;
  report: TDataEntryReport;
  completedAt?: Date;
  status: "in-progress" | "in-checking" | "completed";
  assigneeName?: string; // Added for UI convenience
  createdAt?: Date;
  updatedAt?: Date;
};

export type TCreateDataEntryTask = {
  title: string;
  batchId?: string;
  multiTask: boolean;
  multiTaskId?: string;
  assignedTo: string;
  dueDate: Date;
  schoolTeamTotalLeads: number;
  campaignId: string;
  highestQualification: string;
  preferredProgram: string;
  preferredIntake: string;
  schoolLevel: string;
  schoolName: string;
  message?: string;
};

export type TUpdateDataEntryTask = {
  title: string;
  assignedTo: string;
  dueDate: Date;
  schoolTeamTotalLeads: number;
  campaignId: string;
  highestQualification: string;
  preferredProgram: string;
  preferredIntake: string;
  schoolLevel: string;
  schoolName: string;
  message?: string;
  status: "in-progress" | "in-checking" | "completed";
};
