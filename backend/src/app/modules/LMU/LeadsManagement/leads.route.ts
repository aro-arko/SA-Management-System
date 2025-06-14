import express from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import validateRequest from '../../../middlewares/validateRequest';
import { LeadsManagementValidation } from './leads.validation';
import { leadsController } from './leads.controller';

const router = express.Router();

router.post(
  '/create-task',
  auth(USER_ROLE.lmuAdmin),
  validateRequest(LeadsManagementValidation.leadsCreationValidationSchema),
  leadsController.leadsTaskCreate,
);

router.get(
  '/all-tasks',
  auth(USER_ROLE.coordinator, USER_ROLE.head, USER_ROLE.lmuAdmin),
  leadsController.getAllLeadsTasks,
);

router.post(
  '/add-activity/:taskId',
  auth(
    USER_ROLE.coordinator,
    USER_ROLE.head,
    USER_ROLE.lmuAdmin,
    USER_ROLE.lmuDataLeader,
    USER_ROLE.lmuMember,
    USER_ROLE.emuAdmin,
    USER_ROLE.emuMember,
    USER_ROLE.dsmmAdmin,
    USER_ROLE.hrFinanceAdmin,
  ),
  validateRequest(LeadsManagementValidation.addActivityValidationSchema),
  leadsController.addActivity,
);

router.patch(
  '/update-task/:taskId',
  auth(USER_ROLE.lmuAdmin),
  validateRequest(LeadsManagementValidation.updateTaskValidationSchema),
  leadsController.updateTask,
);

// delete task
router.delete(
  '/delete-task/:taskId',
  auth(USER_ROLE.lmuAdmin),
  leadsController.deleteTask,
);

export const LeadsManagementRoutes = router;
