import CoordinatorDashboard from "@/components/modules/WithDashboardLayout/COORDINATOR/dashboard/CoordinatorDashboard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coordinator Dashboard",
  description: "View your dashboard and manage your tasks as a coordinator.",
};

const CoordinatorDashboardPage = () => {
  return (
    <div>
      <CoordinatorDashboard />
    </div>
  );
};

export default CoordinatorDashboardPage;
