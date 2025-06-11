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

export const LeadsManagementRoutes = router;
