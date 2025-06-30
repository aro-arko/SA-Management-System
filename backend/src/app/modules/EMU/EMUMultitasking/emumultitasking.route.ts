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

router.get(
  '/',
  auth(
    USER_ROLE.coordinator,
    USER_ROLE.head,
    USER_ROLE.lmuDataLeader,
    USER_ROLE.lmuMember,
    USER_ROLE.emuAdmin,
    USER_ROLE.emuMember,
    USER_ROLE.dsmmAdmin,
    USER_ROLE.hrFinanceAdmin,
  ),

  EMUMultiTaskingController.getEMUMultiTaskings,
);

// update multitasking
router.patch(
  '/update-multitasking/:id',
  auth(USER_ROLE.emuAdmin),
  validateRequest(
    EMUMultitaskingValidation.updateEMUMultitaskingValidationSchema,
  ),
  EMUMultiTaskingController.updateEMUMultiTaskings,
);

// apply for multitasking
router.patch(
  '/apply-multitasking/:id',
  auth(
    USER_ROLE.head,
    USER_ROLE.lmuAdmin,
    USER_ROLE.lmuDataLeader,
    USER_ROLE.lmuMember,
    USER_ROLE.dsmmAdmin,
    USER_ROLE.hrFinanceAdmin,
  ),
  EMUMultiTaskingController.applyEMUMultiTasking,
);

export const EMUMultiTaskingRoutes = router;
