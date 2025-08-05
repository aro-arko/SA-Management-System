export type TSignInData = {
  title: string;
  taskId: string;
  attendanceRecord: [
    {
      userId: string;
      signInTime: Date;
    }
  ];
};

export type TSignOutData = {
  title: string;
  taskId: string;
  attendanceRecord: [
    {
      userId: string;
      signOutTime: Date;
    }
  ];
};
