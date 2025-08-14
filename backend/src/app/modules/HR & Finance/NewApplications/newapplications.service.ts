import { TNewApplication } from './newapplications.interface';
import { NewApplication } from './newapplications.model';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';
import QueryBuilder from '../../../builder/QueryBuilder';

const applyNewApplication = async (payLoad: TNewApplication) => {
  const existingApplications = await NewApplication.find({
    studentId: payLoad.studentId,
  }).sort({ createdAt: -1 });

  const latestApplication = existingApplications[0];

  if (latestApplication) {
    if (!latestApplication.isChecked) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'Your previous application is still pending review. You cannot re-apply at this time.',
      );
    }

    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    if (
      latestApplication.createdAt &&
      latestApplication.createdAt > threeMonthsAgo
    ) {
      throw new AppError(
        httpStatus.BAD_REQUEST,
        'You have already applied within the last 3 months. Please wait before re-applying.',
      );
    }
  }

  const application = await NewApplication.create(payLoad);

  return application;
};

// get all applications
const getAllApplications = async (query: Record<string, unknown> = {}) => {
  const filters: Record<string, unknown> = {};

  const baseQuery = NewApplication.find(filters);

  const qb = new QueryBuilder(baseQuery, query);

  const applications = await qb
    .search(['fullName', 'email', 'studentId'], ['studentId'])
    .filter()
    .sortByCreatedAt('desc')
    .paginate()
    .fields()
    .modelQuery.lean();

  return applications;
};

// get application details
const getApplicationDetails = async (id: string) => {
  const application = await NewApplication.findById(id).lean();

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
  }
  return application;
};

// update application status
const updateApplicationStatus = async (
  id: string,
  data: { isChecked: boolean },
) => {
  const application = await NewApplication.findByIdAndUpdate(id, data, {
    new: true,
  });

  if (!application) {
    throw new AppError(httpStatus.NOT_FOUND, 'Application not found');
  }

  return application;
};

export const NewApplicationService = {
  applyNewApplication,
  getAllApplications,
  updateApplicationStatus,
  getApplicationDetails,
};
