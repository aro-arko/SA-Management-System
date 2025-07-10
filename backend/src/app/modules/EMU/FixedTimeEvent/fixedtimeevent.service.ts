import { JwtPayload } from 'jsonwebtoken';
import { TFixedTimeEvent } from './fixedtimeevent.interface';
import { FixedTimeEvent } from './fixedtimeevent.model';
import { User } from '../../User/user.model';
import QueryBuilder from '../../../builder/QueryBuilder';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { EMUMultiTasking } from '../EMUMultitasking/emumultitasking.model';
import { SignInDataModel } from '../../Attendance/SignInData/signindata.model';

const createFixedTimeEvent = async (
  currentUser: JwtPayload,
  payLoad: TFixedTimeEvent,
) => {
  const { email } = currentUser;

  const user = await User.findOne({ email }, { _id: 1 });
  if (!user?._id) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  const session = await FixedTimeEvent.startSession();

  try {
    session.startTransaction();

    // ✅ 1️⃣ Create the event
    const [createdEvent] = await FixedTimeEvent.create(
      [
        {
          ...payLoad,
          createdBy: user._id,
        },
      ],
      { session },
    );

    if (!createdEvent?._id) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create event',
      );
    }

    // ✅ 2️⃣ Create the SignInData
    const existingSignInData = await SignInDataModel.findOne(
      { taskId: createdEvent._id },
      null,
      { session },
    );

    if (existingSignInData) {
      throw new AppError(
        httpStatus.CONFLICT,
        'Sign-in data for this task already exists',
      );
    }

    const [createdSignIn] = await SignInDataModel.create(
      [
        {
          taskId: createdEvent._id,
          title: `${createdEvent.title} Sign-in Data`,
          attendanceRecord: [],
        },
      ],
      { session },
    );

    if (!createdSignIn?._id) {
      throw new AppError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to create sign-in data',
      );
    }

    // ✅ 3️⃣ Update event with signInData ref
    createdEvent.signInData = createdSignIn._id;
    await createdEvent.save({ session });

    await session.commitTransaction();

    return {
      event: createdEvent,
      signInData: createdSignIn,
    };
  } catch (error) {
    await session.abortTransaction();
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      `Failed to create fixed time event: ${error instanceof Error ? error.message : 'Unknown error'}`,
    );
  } finally {
    session.endSession();
  }
};

const getAllFixedTimeEvents = async (query: Record<string, unknown>) => {
  const baseQuery = FixedTimeEvent.find(); // No empty populate

  const queryBuilder = new QueryBuilder(baseQuery, query)
    .sort()
    .paginate()
    .fields();

  const events = await queryBuilder.modelQuery.lean();

  if (!events.length) {
    throw new AppError(httpStatus.NOT_FOUND, 'No events found');
  }
  return events;
};

// update a fixed time event
const updateFixedTimeEvent = async (
  id: string,
  payLoad: Partial<TFixedTimeEvent>,
) => {
  const session = await FixedTimeEvent.startSession();
  session.startTransaction();

  try {
    const event = await FixedTimeEvent.findById(id).session(session);
    if (!event) {
      throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
    }

    const { selectedManpower = [], multiTask, multiTaskId } = payLoad;

    // --- Always compute removed manpower ---
    const previousIds = new Set(
      event.selectedManpower.map((id) => id.toString()),
    );
    const currentIds = new Set(selectedManpower.map((id) => id.toString()));
    const removedIds = [...previousIds].filter((id) => !currentIds.has(id));

    if (removedIds.length > 0) {
      await User.updateMany(
        { _id: { $in: removedIds } },
        {
          $pull: {
            tasks: {
              taskId: id,
            },
          },
        },
        { session },
      );
    }

    // --- If there are new manpowers, validate and update ---
    if (selectedManpower.length > 0) {
      const manpowerUsers = await User.find({
        _id: { $in: selectedManpower },
      }).session(session);

      if (manpowerUsers.length !== selectedManpower.length) {
        throw new AppError(
          httpStatus.BAD_REQUEST,
          'One or more selected manpower users do not exist',
        );
      }

      // Multitask role exception
      const multitaskManpowerSet = new Set<string>();
      if (multiTask && multiTaskId) {
        const multitaskEvent =
          await EMUMultiTasking.findById(multiTaskId).session(session);
        if (!multitaskEvent) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            'Provided multitask event does not exist',
          );
        }

        multitaskEvent.manpower?.forEach((user) =>
          multitaskManpowerSet.add(user.userId.toString()),
        );
      }
      // console.log(multitaskManpowerSet);

      // Role validation
      for (const user of manpowerUsers) {
        const isAllowed =
          user.role === 'emuAdmin' ||
          user.role === 'emuMember' ||
          multitaskManpowerSet.has(user._id.toString());

        if (!isAllowed) {
          throw new AppError(
            httpStatus.BAD_REQUEST,
            `User ${user.firstName} must be EMU member or in multitask event`,
          );
        }
      }

      // Split users based on whether they already have the task
      const usersToAddTask = manpowerUsers
        .filter(
          (user) => !user.tasks?.some((task) => task.taskId.toString() === id),
        )
        .map((user) => user._id);

      if (usersToAddTask.length > 0) {
        await User.updateMany(
          { _id: { $in: usersToAddTask } },
          {
            $addToSet: {
              tasks: {
                taskId: id,
                unit: 'EMU',
                type: 'Event',
                category: 'FixedTimeEvent',
              },
            },
          },
          { session },
        );
      }

      event.selectedManpower = selectedManpower as Types.ObjectId[];
    } else {
      event.selectedManpower = [];
    }

    // --- Update event fields ---
    Object.assign(event, {
      title: payLoad.title ?? event.title,
      eventDate: payLoad.eventDate ?? event.eventDate,
      startTime: payLoad.startTime ?? event.startTime,
      endTime: payLoad.endTime ?? event.endTime,
      multiTask: payLoad.multiTask ?? event.multiTask,
      multiTaskId: payLoad.multiTaskId ?? event.multiTaskId,
      status: payLoad.status ?? event.status,
    });

    const updatedEvent = await event.save({ session });

    await session.commitTransaction();
    return updatedEvent;
  } catch (error) {
    await session.abortTransaction();
    // console.error('Transaction error:', error);
    if (error instanceof AppError) throw error;
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to update event',
    );
  } finally {
    session.endSession();
  }
};

// Delete a fixed time event
const deleteFixedTimeEvent = async (id: string) => {
  const event = await FixedTimeEvent.findById(id);
  if (!event) {
    throw new AppError(httpStatus.NOT_FOUND, 'Event not found');
  }

  const session = await FixedTimeEvent.startSession();
  try {
    session.startTransaction();

    // Remove event from all selected manpower users
    await User.updateMany(
      { _id: { $in: event.selectedManpower } },
      {
        $pull: {
          tasks: {
            taskId: id,
          },
        },
      },
      { session },
    );

    // Delete the event
    await FixedTimeEvent.deleteOne({ _id: id }).session(session);

    await session.commitTransaction();
  } catch (error) {
    await session.abortTransaction();
    if (error instanceof AppError) throw error;
    throw new AppError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Failed to delete event',
    );
  } finally {
    session.endSession();
  }
};

export const FixedTimeEventService = {
  createFixedTimeEvent,
  getAllFixedTimeEvents,
  deleteFixedTimeEvent,
  updateFixedTimeEvent,
};
