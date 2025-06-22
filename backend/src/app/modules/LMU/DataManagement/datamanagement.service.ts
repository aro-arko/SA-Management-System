import { JwtPayload } from 'jsonwebtoken';
import { TDataEntryReport, TDataEntryTask } from './datamanagement.interface';
import { User } from '../../User/user.model';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { LMUMultiTasking } from '../LMUMultitasking/lmumultitasking.model';
import { DataEntryTask } from './datamanagement.model';
import { LMUDataBatch } from '../LMUDataBatch/lmudatabatch.model';
import QueryBuilder from '../../../builder/QueryBuilder';

// create a data entry task
const createDataEntryTask = async (
  currentUser: JwtPayload,
  payLoad: TDataEntryTask,
) => {
  const { email } = currentUser;
  const { batchId, assignedTo, multiTask, multiTaskId } = payLoad;

  const currentAdmin = await User.findOne({ email }, { _id: 1 }).lean();
  if (!currentAdmin) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Please login again to continue',
    );
  }

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const assignedUser = await User.findById(assignedTo, {
      _id: 1,
      unit: 1,
    }).lean();
    if (!assignedUser) {
      throw new AppError(httpStatus.NOT_FOUND, 'Assigned user not found');
    }

    const isLMUMember = assignedUser.unit === 'LMU';

    if (!isLMUMember) {
      if (!multiTask || !multiTaskId) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Assigned user is not part of LMU and multitasking details are missing',
        );
      }

      const multitask =
        await LMUMultiTasking.findById(multiTaskId).session(session);
      if (
        !multitask ||
        multitask.status !== 'active' ||
        multitask.type !== 'data-entry'
      ) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Invalid multitasking information',
        );
      }

      const isMember = multitask.manpower.some(
        (m) => m.userId.toString() === assignedTo.toString(),
      );

      if (!isMember) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Assigned user is not in multitasking team',
        );
      }
    }

    // Create the task
    const createdTask = await DataEntryTask.create(
      [
        {
          ...payLoad,
          createdBy: currentAdmin._id,
        },
      ],
      { session },
    );

    // Update user's tasks
    const userUpdatePromise = await User.findByIdAndUpdate(
      assignedTo,
      {
        $push: {
          tasks: {
            taskId: createdTask[0]._id,
            unit: 'LMU',
            type: 'data-entry',
            category: 'DataEntryTask',
          },
        },
      },
      { session },
    );

    // update batchId if provided
    let batchUpdatePromise = Promise.resolve();
    if (batchId) {
      batchUpdatePromise = (async () => {
        const dataBatch = await LMUDataBatch.findById(batchId).session(session);
        if (!dataBatch) {
          throw new AppError(
            httpStatus.NOT_FOUND,
            'Data batch not found or inactive',
          );
        }
        if (!dataBatch.isActive) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Data batch is not active',
          );
        }
        if (dataBatch.type !== 'data-entry') {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Data batch type does not match with task type',
          );
        }

        dataBatch.expectedTotalLeads += payLoad.schoolTeamTotalLeads;
        dataBatch.tasks.push(createdTask[0]._id);
        dataBatch.assignedSets = dataBatch.tasks.length;
        await dataBatch.save({ session });
      })();
    }
    await Promise.all([userUpdatePromise, batchUpdatePromise]);
    await session.commitTransaction();
    return createdTask[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// get all data entry tasks
const getAllDataEntryTasks = async (query: Record<string, unknown>) => {
  const baseQuery = DataEntryTask.find()
    .populate('assignedTo', 'lastName')
    .populate('batchId', 'title type status');

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .sort()
    .paginate()
    .fields();

  const tasks = await queryBuilder.modelQuery.lean();

  if (!tasks.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No data entry tasks found');
  }

  return tasks;
};

// update a data entry task

const updateDataEntryTask = async (
  taskId: string,
  payLoad: Partial<TDataEntryTask>,
) => {
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const task = await DataEntryTask.findById(taskId).session(session);
    if (!task) {
      throw new AppError(httpStatus.NOT_FOUND, 'Data entry task not found');
    }

    const originalAssignedTo = task.assignedTo?.toString();
    const newAssignedTo = payLoad.assignedTo?.toString();

    const isReassigned = newAssignedTo && newAssignedTo !== originalAssignedTo;

    if (isReassigned) {
      const [prevUser, newUser] = await Promise.all([
        User.findById(originalAssignedTo).session(session),
        User.findById(newAssignedTo).session(session),
      ]);

      if (!newUser) {
        throw new AppError(httpStatus.NOT_FOUND, 'Assigned user not found');
      }

      // Validate new assignee: LMU or multitasking team member
      const isLMUMember = newUser.unit === 'LMU';
      let isValidMultiTaskMember = false;

      if (task.multiTaskId) {
        const multiTask = await LMUMultiTasking.findById(
          task.multiTaskId,
        ).session(session);
        if (!multiTask || multiTask.status !== 'active') {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Cannot reassign task from inactive multitasking group',
          );
        }

        isValidMultiTaskMember = multiTask.manpower.some(
          (m) => m.userId.toString() === newAssignedTo,
        );
      }

      if (!isLMUMember && !isValidMultiTaskMember) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'Assigned user must be an LMU member or valid multitasking participant',
        );
      }

      // Update previous user's task list
      if (prevUser) {
        prevUser.tasks = (prevUser.tasks || []).filter(
          (t) => t.taskId.toString() !== taskId,
        );
        await prevUser.save({ session });
      }

      // Add task to new user's task list if not already assigned
      if (!newUser.tasks?.some((t) => t.taskId.toString() === taskId)) {
        newUser.tasks = newUser.tasks || [];
        newUser.tasks.push({
          taskId: task._id,
          unit: 'LMU',
          type: 'data-entry',
          category: 'DataEntryTask',
        });
        await newUser.save({ session });
      }

      task.assignedTo = payLoad.assignedTo!;
    }

    // Handle schoolTeamTotalLeads and related logic
    const newSchoolTotal = payLoad.schoolTeamTotalLeads;
    if (typeof newSchoolTotal === 'number') {
      const prevSchoolTotal = task.schoolTeamTotalLeads || 0;
      const leadCount = payLoad.totalLeads ?? task.totalLeads;

      task.missingOrExtraLeads = Math.abs(leadCount - newSchoolTotal);
      task.schoolTeamTotalLeads = newSchoolTotal;

      // Update batch lead counts accordingly
      const dataBatch = await LMUDataBatch.findById(task.batchId).session(
        session,
      );
      if (dataBatch) {
        dataBatch.expectedTotalLeads += newSchoolTotal - prevSchoolTotal;
        if (payLoad.status) {
          if (
            (task.status === 'in-progress' || task.status === 'in-checking') &&
            payLoad.status === 'completed'
          ) {
            dataBatch.completedSets += 1;
          } else if (
            task.status === 'completed' &&
            payLoad.status !== 'completed'
          ) {
            dataBatch.completedSets -= 1;
          }
        }
        await dataBatch.save({ session });
      }
    }

    // Apply any remaining updates to the task
    Object.assign(task, payLoad);

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

// submit report for a data entry task
const submitReport = async (
  currentUser: JwtPayload,
  payLoad: TDataEntryReport,
  taskId: string,
) => {
  const { email } = currentUser;
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    const userData = await User.findOne({ email }, { _id: 1 }).lean();

    const task = await DataEntryTask.findById(taskId).session(session);
    if (!task) {
      throw new AppError(httpStatus.NOT_FOUND, 'Data entry task not found');
    }

    if (task.assignedTo.toString() !== userData?._id.toString()) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not authorized to submit report for this task',
      );
    }

    if (task.dueDate && new Date(task.dueDate) < new Date()) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Task is overdue, cannot submit report',
      );
    }

    if (task.status === 'completed') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Task is already completed, cannot submit report',
      );
    }

    const receivedLeads = payLoad.completedLeads + (payLoad.flaggedLeads ?? 0);
    task.missingOrExtraLeads = Math.abs(
      receivedLeads - task.schoolTeamTotalLeads,
    );
    task.status = 'in-checking';
    task.totalLeads = payLoad.completedLeads;
    task.report = {
      completedLeads: payLoad.completedLeads,
      flaggedLeads: payLoad.flaggedLeads ?? 0,
      fileLink: payLoad.fileLink,
      remarks: payLoad.remarks,
    };
    await task.save({ session });

    const dataBatch = await LMUDataBatch.findById(task.batchId).session(
      session,
    );
    if (dataBatch) {
      dataBatch.submittedSets += 1;
      dataBatch.completedLeads += payLoad.completedLeads;
      await dataBatch.save({ session });
    }

    await session.commitTransaction();
    return task.report;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// edit report for a data entry task
const editReport = async (
  currentUser: JwtPayload,
  payLoad: TDataEntryReport,
  taskId: string,
) => {
  const { email } = currentUser;

  const userData = await User.findOne({ email }, { _id: 1 }).lean();
  if (!userData) {
    throw new AppError(httpStatus.UNAUTHORIZED, 'User not found');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    // Fetch task in transaction
    const task = await DataEntryTask.findById(taskId)
      .session(session)
      .select(
        'report assignedTo batchId totalLeads missingOrExtraLeads schoolTeamTotalLeads status',
      );

    if (!task) {
      throw new AppError(httpStatus.NOT_FOUND, 'Data entry task not found');
    }

    if (task.assignedTo.toString() !== userData._id.toString()) {
      throw new AppError(
        httpStatus.FORBIDDEN,
        'You are not authorized to edit report for this task',
      );
    }

    if (task.status === 'completed') {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Cannot edit report for a completed task',
      );
    }

    // Adjust batch.completedLeads if applicable
    const batch = await LMUDataBatch.findById(task.batchId).session(session);
    if (batch) {
      batch.completedLeads -= task.report?.completedLeads || 0;
    }

    // Update task fields directly
    const newCompleted = payLoad.completedLeads || 0;
    const newFlagged = payLoad.flaggedLeads || 0;

    task.report = {
      completedLeads: newCompleted,
      flaggedLeads: newFlagged,
      fileLink: payLoad.fileLink,
      remarks: payLoad.remarks,
    };

    task.totalLeads = newCompleted;
    task.missingOrExtraLeads = Math.abs(
      newCompleted + newFlagged - (task.schoolTeamTotalLeads || 0),
    );
    await task.save({ session });

    // Re-add new completed leads
    if (batch) {
      batch.completedLeads += newCompleted;
      await batch.save({ session });
    }

    await session.commitTransaction();
    return task;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const DataManagementService = {
  createDataEntryTask,
  getAllDataEntryTasks,
  updateDataEntryTask,
  submitReport,
  editReport,
};
