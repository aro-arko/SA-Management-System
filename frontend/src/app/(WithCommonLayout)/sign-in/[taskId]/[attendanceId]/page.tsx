import SignIn from "@/components/modules/WithDashboardLayout/Event Management Unit/Attendance/SignIn";

export default function Page({
  params,
}: {
  params: { attendanceId: string; eventId: string };
}) {
  const { attendanceId, eventId } = params;
  return <SignIn attendanceId={attendanceId} eventId={eventId} />;
}
