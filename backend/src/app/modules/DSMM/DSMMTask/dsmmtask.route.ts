import express from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import validateRequest from '../../../middlewares/validateRequest';
import { DSMMTaskValidation } from './dsmmtask.validation';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.dsmmAdmin),
  validateRequest(DSMMTaskValidation.createDSMMTask),
);

export const DSMMTaskRoutes = router;
