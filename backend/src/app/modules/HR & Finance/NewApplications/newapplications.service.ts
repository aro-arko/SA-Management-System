import { TNewApplication } from './newapplications.interface';
import { NewApplication } from './newapplications.model';
import AppError from '../../../errors/AppError';
import httpStatus from 'http-status';

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

export const NewApplicationService = {
  applyNewApplication,
};
