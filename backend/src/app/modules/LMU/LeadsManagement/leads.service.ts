import mongoose, { Types } from 'mongoose';
import AppError from '../../../errors/AppError';
import { User } from '../../User/user.model';
import { TActivity, TLeadsTask } from './leads.interface';
import httpStatus from 'http-status';
import { LeadsTask } from './leads.model';
import { JwtPayload } from 'jsonwebtoken';
import { LMULeadsGoal } from '../LMULeadsGoals/lmuleadsgoals.model';
import { LMUMultiTasking } from '../LMUMultitasking/lmumultitasking.model';
import QueryBuilder from '../../../builder/QueryBuilder';

const leadsTaskCreate = async (
  currentUser: JwtPayload,
  payLoad: TLeadsTask,
) => {
  const { email, role } = currentUser;
  const { goalId, assignedTo, multiTask, multiTaskId } = payLoad;

  const currentAdmin = await User.findOne({ email }, { _id: 1 });
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
        const lmuGoal = await LMULeadsGoal.findById(goalId).session(session);
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

// get all leads tasks
const getAllLeadsTasks = async (query: Record<string, unknown>) => {
  const baseQuery = LeadsTask.find()
    .populate('assignedTo', 'lastName')
    .populate('goalId', 'title type status');

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .sort()
    .paginate()
    .fields();

  const tasks = await queryBuilder.modelQuery.lean();

  if (!tasks.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No leads tasks found');
  }

  return tasks;
};

// add activity to leads task
const addActivity = async (user: JwtPayload, id: string, data: TActivity) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid task ID');
  }

  const userData = await User.findOne({ email: user.email }, { _id: 1 });
  if (!userData) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Please login again to continue',
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // Find task in session
    const task = await LeadsTask.findById(id).session(session);
    if (!task) {
      throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
    }

    // Confirm task ownership
    if (task.assignedTo.toString() !== userData._id.toString()) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not assigned to this task',
      );
    }

    const currentTotalLeads = data.completedLeads + data.flaggedLeads;

    if (currentTotalLeads > task.remainingLeads) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Total completed and flagged leads cannot exceed remaining leads',
      );
    }

    // Goal update
    if (task.goalId) {
      const goal = await LMULeadsGoal.findById(task.goalId).session(session);
      if (!goal) {
        throw new AppError(httpStatus.NOT_FOUND, 'Associated goal not found');
      }

      goal.completed += currentTotalLeads;
      goal.remaining -= currentTotalLeads;

      if (goal.remaining < 0) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Total completed leads cannot exceed goal remaining leads',
        );
      }

      await goal.save({ session });
    }

    // Task update
    task.remainingLeads -= currentTotalLeads;
    task.completedLeads += currentTotalLeads;

    if (task.remainingLeads === 0) {
      task.status = 'completed';
    }

    task.activities.push(data);
    const result = await task.save({ session });

    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const updateTask = async (
  currentUser: JwtPayload,
  taskId: string,
  data: Partial<TLeadsTask>,
) => {
  if (!Types.ObjectId.isValid(taskId)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid task ID');
  }

  const userData = await User.findOne({ email: currentUser.email }, { _id: 1 });
  if (!userData) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Please login again to continue',
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const task = await LeadsTask.findById(taskId).session(session);
    if (!task) {
      throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
    }

    // Handle reassignment
    if (
      data.assignedTo &&
      data.assignedTo.toString() !== task.assignedTo?.toString()
    ) {
      const [prevUser, newUser] = await Promise.all([
        User.findById(task.assignedTo).session(session),
        User.findById(data.assignedTo).session(session),
      ]);

      // Remove from previous user
      if (prevUser) {
        prevUser.tasks =
          prevUser.tasks?.filter((t) => t.taskId.toString() !== taskId) || [];
        await prevUser.save({ session });
      }

      // Add to new user
      if (newUser) {
        const alreadyAssigned = newUser.tasks?.some(
          (t) => t.taskId.toString() === taskId,
        );
        if (!alreadyAssigned) {
          newUser.tasks = newUser.tasks || [];
          newUser.tasks.push({
            taskId: task._id,
            unit: 'LMU',
            type: task.type,
            category: 'LeadsTask',
          });
          await newUser.save({ session });
        }
      }

      // Update task assignedTo field
      task.assignedTo = data.assignedTo;
    }

    // Apply other updates to the task
    Object.assign(task, data);
    const updatedTask = await task.save({ session });

    await session.commitTransaction();
    return updatedTask;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// delete task
const deleteTask = async (id: string) => {
  if (!Types.ObjectId.isValid(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid task ID');
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const task = await LeadsTask.findById(id).session(session);
    if (!task) {
      throw new AppError(httpStatus.NOT_FOUND, 'Task not found');
    }

    // Remove task reference from the assigned user
    const userUpdatePromise = User.updateOne(
      { _id: task.assignedTo },
      { $pull: { tasks: { taskId: task._id } } },
      { session },
    );

    // Remove task reference from the goal (if exists)
    const goalUpdatePromise = task.goalId
      ? LMULeadsGoal.findByIdAndUpdate(
          task.goalId,
          {
            $inc: {
              completed: -task.completedLeads,
              remaining: -task.remainingLeads,
              total: -task.totalLeads,
            },
            $pull: { tasks: task._id },
          },
          { session },
        )
      : Promise.resolve();

    // Delete the task
    const deleteTaskPromise = LeadsTask.deleteOne(
      { _id: task._id },
      { session },
    );

    // Run all in parallel
    await Promise.all([
      userUpdatePromise,
      goalUpdatePromise,
      deleteTaskPromise,
    ]);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const leadsServices = {
  leadsTaskCreate,
  addActivity,
  updateTask,
  deleteTask,
  getAllLeadsTasks,
};
