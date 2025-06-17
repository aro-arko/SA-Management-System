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

// get all data entry tasks
router.get(
  '/all-tasks',
  auth(
    USER_ROLE.lmuDataLeader,
    USER_ROLE.lmuAdmin,
    USER_ROLE.coordinator,
    USER_ROLE.head,
  ),
  DataManagementController.getAllDataEntryTasks,
);

// update a data entry task
router.patch(
  '/update-data-entry-task/:id',
  auth(USER_ROLE.lmuDataLeader, USER_ROLE.lmuAdmin),
  validateRequest(DataManagementValidation.updateDataEntryTask),
  DataManagementController.updateDataEntryTask,
);

// add report to a data entry task
// router.post('/submit-report');

export const dataManagementRoutes = router;
