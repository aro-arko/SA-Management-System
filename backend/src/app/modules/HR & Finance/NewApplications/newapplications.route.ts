import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { NewApplicationValidation } from './newapplications.validation';
import { NewApplicationController } from './newapplications.controller';
import { USER_ROLE } from '../../User/user.constant';
import auth from '../../../middlewares/auth';

const router = express.Router();

// apply routes for new applications
router.post(
  '/apply',
  validateRequest(NewApplicationValidation.applyNewApplicationValidationSchema),
  NewApplicationController.applyNewApplication,
);

// get all applications
router.get(
  '/',
  auth(USER_ROLE.hrFinanceAdmin),
  NewApplicationController.getAllApplications,
);

// get appliation details
router.get(
  '/:id',
  auth(USER_ROLE.hrFinanceAdmin),
  NewApplicationController.getApplicationDetails,
);

export const NewApplicationsRoutes = router;
