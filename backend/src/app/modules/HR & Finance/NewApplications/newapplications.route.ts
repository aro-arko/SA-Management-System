import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { NewApplicationValidation } from './newapplications.validation';

const router = express.Router();

// apply routes for new applications
router.post(
  '/apply',
  validateRequest(NewApplicationValidation.applyNewApplicationValidationSchema),
);

export const NewApplicationsRoutes = router;
