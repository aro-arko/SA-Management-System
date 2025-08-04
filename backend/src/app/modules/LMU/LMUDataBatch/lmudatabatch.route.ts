import express from 'express';
import auth from '../../../middlewares/auth';
import { USER_ROLE } from '../../User/user.constant';
import validateRequest from '../../../middlewares/validateRequest';
import { LMUDataBatchValidation } from './lmudatabatch.validation';
import { LMUDataBatchController } from './lmudatabatch.controller';

const router = express.Router();

// create a new LMU Data Batch
router.post(
  '/create',
  auth(USER_ROLE.lmuDataLeader, USER_ROLE.lmuAdmin),
  validateRequest(LMUDataBatchValidation.createDataBatch),
  LMUDataBatchController.createDataBatch,
);

// access LMU Data Batches
router.get(
  '/all',
  auth(
    USER_ROLE.lmuDataLeader,
    USER_ROLE.lmuAdmin,
    USER_ROLE.coordinator,
    USER_ROLE.head,
  ),
  LMUDataBatchController.getAllDataBatches,
);

router.get(
  '/:id',
  auth(
    USER_ROLE.coordinator,
    USER_ROLE.head,
    USER_ROLE.lmuAdmin,
    USER_ROLE.lmuDataLeader,
  ),
  LMUDataBatchController.getDataBatchById,
);

router.patch(
  '/update/:id',
  auth(USER_ROLE.lmuDataLeader, USER_ROLE.lmuAdmin),
  validateRequest(LMUDataBatchValidation.updateDataBatch),
  LMUDataBatchController.updateDataBatch,
);

export const LMUDataBatchRoutes = router;
