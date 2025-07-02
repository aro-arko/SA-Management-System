import express from 'express';
import validateRequest from '../../../middlewares/validateRequest';
import { FixedTimeEventValidationSchema } from './fixedtimeevent.validation';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import { FixedTimeEventController } from './fixedtimeevent.controller';

const router = express.Router();

// create a new fixed time event
router.post(
  '/create',
  auth(USER_ROLE.emuAdmin),
  validateRequest(
    FixedTimeEventValidationSchema.createFixedTimeEventValidation,
  ),
  FixedTimeEventController.createFixedTimeEvent,
);

export const FixedTimeEventRoutes = router;
