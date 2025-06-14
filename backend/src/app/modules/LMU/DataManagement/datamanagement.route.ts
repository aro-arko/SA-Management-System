import express from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import validateRequest from '../../../middlewares/validateRequest';
import { DataManagementValidation } from './datamanagement.validation';
import { DataManagementController } from './datamanagement.controller';

const router = express.Router();

// create a data entry task
router.post(
  '/create-data-entry-task',
  auth(USER_ROLE.lmuDataLeader, USER_ROLE.lmuAdmin),
  validateRequest(DataManagementValidation.createDataEntryTask),
  DataManagementController.createDataEntryTask,
);

export const dataManagementRoutes = router;
