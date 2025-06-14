import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { LMUGoalsValidation } from './lmuleadsgoals.validation';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import { lmuGoalsController } from './lmuleadsgoals.controller';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.lmuAdmin),
  validateRequest(LMUGoalsValidation.createLmuGoalValidation),
  lmuGoalsController.createLmuGoal,
);

router.get(
  '/all',
  auth(
    USER_ROLE.lmuAdmin,
    USER_ROLE.coordinator,
    USER_ROLE.head,
    USER_ROLE.lmuMember,
    USER_ROLE.lmuDataLeader,
  ),
  lmuGoalsController.getAllLmuGoals,
);

router.patch(
  '/:id',
  auth(USER_ROLE.lmuAdmin),
  validateRequest(LMUGoalsValidation.updateLmuGoalValidation),
  lmuGoalsController.updateLmuGoal,
);

export const LMUGoalsRoutes = router;
