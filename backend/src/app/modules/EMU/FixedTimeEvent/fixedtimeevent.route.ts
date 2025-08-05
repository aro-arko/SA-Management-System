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

// get all fixed time events
router.get(
  '/all',
  auth(USER_ROLE.coordinator, USER_ROLE.head, USER_ROLE.emuAdmin),
  FixedTimeEventController.getAllFixedTimeEvents,
);

// get a fixed time event by id
router.get(
  '/:id',
  auth(USER_ROLE.coordinator, USER_ROLE.head, USER_ROLE.emuAdmin),
  FixedTimeEventController.getFixedTimeEventById,
);

// update a fixed time event
router.patch(
  '/update/:id',
  auth(USER_ROLE.emuAdmin),
  validateRequest(
    FixedTimeEventValidationSchema.updateFixedTimeEventValidation,
  ),
  FixedTimeEventController.updateFixedTimeEvent,
);

// delete a fixed time event
router.delete(
  '/delete/:id',
  auth(USER_ROLE.emuAdmin),
  FixedTimeEventController.deleteFixedTimeEvent,
);

export const FixedTimeEventRoutes = router;
