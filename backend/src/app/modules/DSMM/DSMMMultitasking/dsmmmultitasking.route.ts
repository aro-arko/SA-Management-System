import express from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import validateRequest from '../../../middlewares/validateRequest';
import { DSMMMultitaskingValidation } from './dsmmmultitasking.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.dsmmAdmin),
  validateRequest(
    DSMMMultitaskingValidation.createDSMMMultitaskingValidationSchema,
  ),
);

export const DSMMMultitaskingRoutes = router;
