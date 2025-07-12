import express from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import validateRequest from '../../../middlewares/validateRequest';
import { DSMMTaskValidation } from './dsmmtask.validation';
import { DSMMTaskController } from './dsmmtask.controller';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.dsmmAdmin),
  validateRequest(DSMMTaskValidation.createDSMMTask),
  DSMMTaskController.createDSMMTask,
);

router.get(
  '/all',
  auth(USER_ROLE.coordinator, USER_ROLE.head, USER_ROLE.dsmmAdmin),
  DSMMTaskController.getAllDSMMTasks,
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.dsmmAdmin),
  validateRequest(DSMMTaskValidation.updateDSMMTask),
  DSMMTaskController.updateDSMMTask,
);

router.delete(
  '/delete/:id',
  auth(USER_ROLE.dsmmAdmin),
  DSMMTaskController.deleteDSMMTask,
);

export const DSMMTaskRoutes = router;
