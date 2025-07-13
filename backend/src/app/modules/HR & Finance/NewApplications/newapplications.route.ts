import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { NewApplicationValidation } from './newapplications.validation';
import { NewApplicationController } from './newapplications.controller';

const router = express.Router();

// apply routes for new applications
router.post(
  '/apply',
  validateRequest(NewApplicationValidation.applyNewApplicationValidationSchema),
  NewApplicationController.applyNewApplication,
);

export const NewApplicationsRoutes = router;
