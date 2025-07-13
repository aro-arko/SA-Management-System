import { JwtPayload } from 'jsonwebtoken';
import { THRFinanceTask } from './hrfinancetask.interface';
import { HRFinanceTask } from './hrfinancetask.model';
import { User } from '../../User/user.model';

const createHrFinanceTask = async (
  currentUser: JwtPayload,
  payLoad: THRFinanceTask,
) => {
  const { email } = currentUser;
  const currentUserDetails = await User.findOne({ email }).select('_id');

  // check if the assigned to user from HR Finance unit
  const { assignedTo } = payLoad;
  const assignedUser = await User.findById(assignedTo).select('_id unit');
  if (!assignedUser || assignedUser.unit !== 'HR_FINANCE') {
    throw new Error('Assigned user is not from HR Finance unit');
  }

  const task = await HRFinanceTask.create({
    ...payLoad,
    createdBy: currentUserDetails!._id,
  });

  return task;
};

export const HrFinanceTaskService = {
  createHrFinanceTask,
};
