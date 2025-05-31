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

export const AuthRoutes = router;
