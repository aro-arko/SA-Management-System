export type TSignInData = {
  taskId: string;
  attendanceRecord: [
    {
      userId: string;
      signInTime: Date;
    },
  ];
};
