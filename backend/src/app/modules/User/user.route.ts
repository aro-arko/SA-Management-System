import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';

const router = express.Router();

router.patch(
  '/update',
  validateRequest(UserValidation.userUpdateValidation),
  UserController.userUpdate,
);

export const UserRoutes = router;
