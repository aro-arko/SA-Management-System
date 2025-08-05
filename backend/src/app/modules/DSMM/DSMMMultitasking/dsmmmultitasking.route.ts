import express from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import validateRequest from '../../../middlewares/validateRequest';
import { DSMMMultitaskingValidation } from './dsmmmultitasking.validation';
import { DSMMMultitaskingController } from './dsmmmultasking.controller';

const router = express.Router();

router.post(
  '/create',
  auth(USER_ROLE.dsmmAdmin),
  validateRequest(
    DSMMMultitaskingValidation.createDSMMMultitaskingValidationSchema,
  ),
  DSMMMultitaskingController.createDSMMMultitasking,
);

router.get(
  '/',
  auth(
    USER_ROLE.coordinator,
    USER_ROLE.head,
    USER_ROLE.lmuAdmin,
    USER_ROLE.lmuDataLeader,
    USER_ROLE.lmuMember,
    USER_ROLE.emuAdmin,
    USER_ROLE.emuMember,
    USER_ROLE.dsmmAdmin,
    USER_ROLE.hrFinanceAdmin,
  ),
  DSMMMultitaskingController.getDSMMMultitasking,
);

// get mutitasking by id
router.get(
  '/:id',
  auth(
    USER_ROLE.coordinator,
    USER_ROLE.head,
    USER_ROLE.lmuAdmin,
    USER_ROLE.lmuDataLeader,
    USER_ROLE.lmuMember,
    USER_ROLE.emuAdmin,
    USER_ROLE.emuMember,
    USER_ROLE.dsmmAdmin,
    USER_ROLE.hrFinanceAdmin,
  ),
  DSMMMultitaskingController.getDSMMMultitaskingById,
);

// update multitasking
router.patch(
  '/update-multitasking/:id',
  auth(USER_ROLE.dsmmAdmin),
  validateRequest(
    DSMMMultitaskingValidation.updateDSMMMultitaskingValidationSchema,
  ),
  DSMMMultitaskingController.updateDSMMMultitasking,
);

// apply for multitasking
router.patch(
  '/apply-multitasking/:id',
  auth(
    USER_ROLE.head,
    USER_ROLE.lmuAdmin,
    USER_ROLE.lmuDataLeader,
    USER_ROLE.lmuMember,
    USER_ROLE.emuAdmin,
    USER_ROLE.emuMember,
    USER_ROLE.hrFinanceAdmin,
  ),
  DSMMMultitaskingController.applyDSMMMultitasking,
);

export const DSMMMultitaskingRoutes = router;
