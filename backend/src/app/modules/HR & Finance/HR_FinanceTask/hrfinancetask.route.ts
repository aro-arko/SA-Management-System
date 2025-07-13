import express from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import validateRequest from '../../../middlewares/validateRequest';
import { hrFinanceTaskValidation } from './hrfinancetask.validation';
import { HrFinanceTaskController } from './hrfinancetask.controller';

const router = express.Router();

// create a new HR Finance task
router.post(
  '/create',
  auth(USER_ROLE.hrFinanceAdmin),
  validateRequest(hrFinanceTaskValidation.createHrFinanceTaskValidationSchema),
  HrFinanceTaskController.createHrFinanceTask,
);

// get all HR Finance tasks
router.get(
  '/all-tasks',
  auth(USER_ROLE.coordinator, USER_ROLE.head, USER_ROLE.hrFinanceAdmin),
  HrFinanceTaskController.getAllHrFinanceTasks,
);

// update HR Finance task
router.patch(
  '/update-task/:taskId',
  auth(USER_ROLE.hrFinanceAdmin),
  validateRequest(hrFinanceTaskValidation.updateHrFinanceTaskValidationSchema),
  HrFinanceTaskController.updateHrFinanceTask,
);

export const HRFinanceTaskRoutes = router;
