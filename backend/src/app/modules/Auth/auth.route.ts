import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { authValidation } from './auth.validation';
import { authController } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../User/user.constant';

const router = express.Router();

router.post(
  '/register',
  auth(USER_ROLE.coordinator, USER_ROLE.head),
  validateRequest(authValidation.registerValidation),
  authController.createUser,
);
router.post(
  '/login',
  validateRequest(authValidation.loginValidation),
  authController.loginUser,
);

router.patch(
  '/change-password',
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
  validateRequest(authValidation.changePasswordValidation),
  authController.changePassword,
);

router.post(
  '/forgot-password',
  validateRequest(authValidation.forgotPasswordValidationSchema),
  authController.forgotPassword,
);

export const AuthRoutes = router;
