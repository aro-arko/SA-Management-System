// signin
export const signInAttendance = async (
  attendanceId: string,
  eventId: string
) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_API}/signin-data/sign-in/${attendanceId}/${eventId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return res.json();
  } catch (error) {
    console.error("Error signing in:", error);
  }
};
