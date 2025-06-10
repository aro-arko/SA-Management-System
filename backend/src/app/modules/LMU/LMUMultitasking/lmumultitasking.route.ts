import express from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import validateRequest from '../../../middlewares/validateRequest';
import { LMUMultitaskingValidation } from './lmumultitasking.validation';
import { LMUMultiTaskingController } from './lmumultitasking.controller';

const router = express.Router();

router.post(
  '/create-multitasking',
  auth(USER_ROLE.lmuAdmin, USER_ROLE.lmuDataLeader),
  validateRequest(LMUMultitaskingValidation.createLMUMultitaskingValidation),
  LMUMultiTaskingController.createLMUMultiTasking,
);

router.get(
  '/',
  auth(
    USER_ROLE.coordinator,
    USER_ROLE.head,
    USER_ROLE.lmuDataLeader,
    USER_ROLE.lmuMember,
    USER_ROLE.emuAdmin,
    USER_ROLE.emuMember,
    USER_ROLE.dsmmAdmin,
    USER_ROLE.hrFinanceAdmin,
  ),
  LMUMultiTaskingController.getLMUMultiTaskings,
);

// router.patch('/update-multitasking/:id');

export const LMUMultiTaskingRoutes = router;
