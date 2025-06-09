import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { LMUGoalsValidation } from './lmugoals.validation';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.lmuAdmin),
  validateRequest(LMUGoalsValidation.createLmuGoalValidation),
);

export const LMUGoalsRoutes = router;
