import express from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import validateRequest from '../../../middlewares/validateRequest';
import { EMUMultitaskingValidation } from './emumultitasking.validation';
import { EMUMultiTaskingController } from './emumultasking.controller';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.emuAdmin),
  validateRequest(
    EMUMultitaskingValidation.createEMUMultitaskingValidationSchema,
  ),
  EMUMultiTaskingController.createEmuMultitasking,
);

// router.get('/');

export const EMUMultiTaskingRoutes = router;
