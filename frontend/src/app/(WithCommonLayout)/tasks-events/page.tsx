import DsmmTasks from "@/components/modules/WithCommonLayout/TASK_EVENTS/dsmm/dsmmTasks";
import EmuTasks from "@/components/modules/WithCommonLayout/TASK_EVENTS/emu/emuTasks";
import HrFinanceTasks from "@/components/modules/WithCommonLayout/TASK_EVENTS/hr_finance/HrFinanceTasks";
import LmuTasks from "@/components/modules/WithCommonLayout/TASK_EVENTS/lmu/lmuTasks";

const tasksEventsPage = () => {
  return (
    <div className="pt-16">
      <HrFinanceTasks />
      <LmuTasks />
      <EmuTasks />
      <DsmmTasks />
    </div>
  );
};

export default tasksEventsPage;
