import mongoose from 'mongoose';
import AppError from '../../../errors/AppError';
import { User } from '../../User/user.model';
import { TLeadsTask } from './leads.interface';
import httpStatus from 'http-status';
import { LeadsTask } from './leads.model';
import { JwtPayload } from 'jsonwebtoken';
import { LMUGoalModel } from '../LMUGoals/lmugoals.model';

const leadsTaskCreate = async (
  currentUser: JwtPayload,
  payLoad: TLeadsTask,
) => {
  const { email } = currentUser;

  // Validate current admin user
  const currentAdmin = await User.findOne({ email });
  if (!currentAdmin) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Please login again to continue',
    );
  }

  const { goalId, assignedTo } = payLoad;

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Validate assigned user inside transaction
    const assignedUser = await User.findById(assignedTo).session(session);
    if (!assignedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'Assigned user not found');
    }
    if (assignedUser.unit !== 'LMU') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Assigned user is not a LMU member',
      );
    }

    // Create the task
    const leadsTask = await LeadsTask.create(
      [
        {
          ...payLoad,
          createdBy: currentAdmin._id,
          remainingLeads: payLoad.totalLeads,
        },
      ],
      { session },
    );

    // Validate and update goal
    const lmuGoal = await LMUGoalModel.findById(goalId).session(session);
    if (!lmuGoal) {
      throw new AppError(httpStatus.NOT_FOUND, 'Goal not found or inactive');
    }
    if (!lmuGoal.isActive) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Goal is not active');
    }
    if (lmuGoal.type !== payLoad.type) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Goal type does not match with task type',
      );
    }

    lmuGoal.total += payLoad.totalLeads;
    lmuGoal.remaining += payLoad.totalLeads;

    await lmuGoal.save({ session });

    await session.commitTransaction();
    return leadsTask[0]; // Since .create with array returns an array
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const leadsServices = {
  leadsTaskCreate,
};
