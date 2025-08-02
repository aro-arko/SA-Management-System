import EmuTasks from "@/components/modules/WithCommonLayout/TASK_EVENTS/emu/emuTasks";
import HrFinanceTasks from "@/components/modules/WithCommonLayout/TASK_EVENTS/hr_finance/HrFinanceTasks";
import LmuTasks from "@/components/modules/WithCommonLayout/TASK_EVENTS/lmu/lmuTasks";

const tasksEventsPage = () => {
  return (
    <div className="pt-16">
      <HrFinanceTasks />
      <LmuTasks />
      <EmuTasks />
    </div>
  );
};

export default tasksEventsPage;
