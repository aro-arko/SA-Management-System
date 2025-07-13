import { TNewApplication } from './newapplications.interface';

const applyNewApplication = async (payLoad: TNewApplication) => {
  return 'New application created successfully';
};

export const NewApplicationService = {
  applyNewApplication,
};
