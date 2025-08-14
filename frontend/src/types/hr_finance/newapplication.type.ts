export type TNewApplication = {
  _id: string;
  fullName: string;
  studentId: number;
  expectedGraduationDate: Date;
  email: string;
  phoneNumber: number;
  Faculty: string;
  Major: string;
  ResumeLink: string;
  preferredUnit?: string;
  isChecked: boolean;
  checkedBy: string;
  createdAt?: Date;
  updatedAt?: Date;
};

export type TApplicationFormData = {
  fullName: string;
  studentId: number;
  expectedGraduationDate: Date | string;
  email: string;
  phoneNumber: number;
  Faculty: string;
  Major: string;
  ResumeLink: string;
};
