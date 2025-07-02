import express from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import validateRequest from '../../../middlewares/validateRequest';
import { SignInDataValidation } from './signindata.validation';
import { SignInDataController } from './signindata.controller';

const router = express.Router();

router.post(
  '/create-attendance',
  auth(USER_ROLE.emuAdmin),
  validateRequest(SignInDataValidation.signInDataCreateValidationSchema),
  SignInDataController.createSignInData,
);

router.patch(
  '/sign-in/:taskId/:id',
  validateRequest(SignInDataValidation.signInAttendanceValidationSchema),
  SignInDataController.signInAttendance,
);

export const SignInDataRoutes = router;
