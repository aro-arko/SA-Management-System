import CoordinatorDashboard from "@/components/modules/WithDashboardLayout/COORDINATOR/dashboard/CoordinatorDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tutor Dashboard",
  description: "View your dashboard and manage your tutoring sessions.",
};

const CoordinatorDashboardPage = () => {
  return (
    <div>
      <CoordinatorDashboard />
    </div>
  );
};

export default CoordinatorDashboardPage;
