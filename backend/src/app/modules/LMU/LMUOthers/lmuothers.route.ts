import express from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import validateRequest from '../../../middlewares/validateRequest';
import { LMUOthersValidation } from './lmuothers.validation';
import { LMUOthersController } from './lmuothers.controller';

const router = express.Router();

// others task creation
router.post(
  '/create',
  auth(USER_ROLE.lmuAdmin),
  validateRequest(LMUOthersValidation.CreateLMUOthersTaskValidationSchema),
  LMUOthersController.createOthersTask,
);

export const LMUOthersRoutes = router;
