import express from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import validateRequest from '../../../middlewares/validateRequest';
import { SignOutDataValidation } from './signoutdata.validation';
import { SignOutDataController } from './signoutdata.controller';

const router = express.Router();

router.post(
  '/create-attendance',
  auth(USER_ROLE.emuAdmin),
  validateRequest(SignOutDataValidation.signOutDataCreateValidationSchema),
  SignOutDataController.createSignInData,
);

router.patch(
  '/signout/:taskId/:id',
  validateRequest(SignOutDataValidation.signOutAttendanceValidationSchema),
  SignOutDataController.signOutData,
);

export const SignOutDataRoutes = router;
