import mongoose from 'mongoose';
import AppError from '../../../errors/AppError';
import { User } from '../../User/user.model';
import { TLeadsTask } from './leads.interface';
import httpStatus from 'http-status';
import { LeadsTask } from './leads.model';
import { JwtPayload } from 'jsonwebtoken';
import { LMUGoalModel } from '../LMUGoals/lmugoals.model';
import { LMUMultiTasking } from '../LMUMultitasking/lmumultitasking.model';

const leadsTaskCreate = async (
  currentUser: JwtPayload,
  payLoad: TLeadsTask,
) => {
  const { email, role } = currentUser;
  const { goalId, assignedTo, multiTask, multiTaskId } = payLoad;

  const currentAdmin = await User.findOne({ email });
  if (!currentAdmin) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Please login again to continue',
    );
  }
  if (role !== 'lmuAdmin') {
    throw new AppError(
      httpStatus.FORBIDDEN,
      'You do not have permission to create leads tasks',
    );
  }
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const assignedUser = await User.findById(assignedTo).session(session);
    if (!assignedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'Assigned user not found');
    }

    // Check if LMU member or part of multitasking
    const isLMUMember = assignedUser.unit === 'LMU';
    let isValidMultiTaskMember = false;

    if (!isLMUMember) {
      if (!multiTask || !multiTaskId) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Assigned user is not an LMU member and multitasking details are missing',
        );
      }

      const multiTaskCollection =
        await LMUMultiTasking.findById(multiTaskId).session(session);
      if (
        !multiTaskCollection ||
        multiTaskCollection.status !== 'active' ||
        multiTaskCollection.type !== payLoad.type
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Invalid or mismatched multitasking information',
        );
      }

      const isInTeam = multiTaskCollection.manpower.some(
        (member) => member.userId.toString() === assignedTo.toString(),
      );

      if (!isInTeam) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Assigned user is not part of the multitasking team',
        );
      }

      isValidMultiTaskMember = true;
    }

    if (!isLMUMember && !isValidMultiTaskMember) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Assigned user must be an LMU member or valid multitasking participant',
      );
    }

    // Create the leads task
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

    // Update user tasks in parallel
    const userUpdatePromise = User.findByIdAndUpdate(
      assignedTo,
      {
        $push: {
          tasks: {
            taskId: leadsTask[0]._id,
            unit: 'LMU',
            type: payLoad.type,
            category: 'LeadsTask',
          },
        },
      },
      { session },
    );

    // Update goal if goalId is provided
    let goalUpdatePromise = Promise.resolve();
    if (goalId) {
      goalUpdatePromise = (async () => {
        const lmuGoal = await LMUGoalModel.findById(goalId).session(session);
        if (!lmuGoal) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            'Goal not found or inactive',
          );
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
        lmuGoal.tasks.push(leadsTask[0]._id);

        await lmuGoal.save({ session });
      })();
    }

    // Wait for both updates to finish
    await Promise.all([userUpdatePromise, goalUpdatePromise]);

    await session.commitTransaction();
    return leadsTask[0];
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
