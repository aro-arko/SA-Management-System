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

// update others task
router.put(
  '/update/:id',
  auth(USER_ROLE.lmuAdmin),
  validateRequest(LMUOthersValidation.UpdateLMUOthersTaskValidationSchema),
  LMUOthersController.updateOthersTask,
);

// delete others task
router.delete(
  '/delete/:id',
  auth(USER_ROLE.lmuAdmin),
  LMUOthersController.deleteOthersTask,
);

// get all others tasks
router.get(
  '/all',
  auth(USER_ROLE.lmuAdmin, USER_ROLE.head, USER_ROLE.coordinator),
  LMUOthersController.getAllOthersTasks,
);

export const LMUOthersRoutes = router;
