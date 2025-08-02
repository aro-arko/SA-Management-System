import HrFinanceTasks from "@/components/modules/WithCommonLayout/TASK_EVENTS/hr_finance/HrFinanceTasks";
import LmuTasks from "@/components/modules/WithCommonLayout/TASK_EVENTS/lmu/lmuTasks";

const tasksEventsPage = () => {
  return (
    <div className="pt-16">
      <HrFinanceTasks />
      <LmuTasks />
    </div>
  );
};

export default tasksEventsPage;
