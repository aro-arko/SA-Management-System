import { JwtPayload } from 'jsonwebtoken';
import { TDSMMTask } from './dsmmtask.interface';
import { DSMMTaskModel } from './dsmmtask.model';

const createDSMMTask = async (currentUser: JwtPayload, payLoad: TDSMMTask) => {
  const result = await DSMMTaskModel.create({
    ...payLoad,
    createdBy: currentUser._id,
  });

  return result;
};

export const DSMMTaskService = {
  createDSMMTask,
};
