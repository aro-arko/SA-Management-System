export type TNewApplication = {
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
