import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.patch(
  '/update',
  auth(USER_ROLE.coordinator, USER_ROLE.head),
  validateRequest(UserValidation.userUpdateValidation),
  UserController.userUpdate,
);

export const UserRoutes = router;
