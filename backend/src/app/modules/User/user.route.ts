import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.patch(
  '/update',
  auth(USER_ROLE.coordinator, USER_ROLE.head),
  validateRequest(UserValidation.userUpdateValidation),
  UserController.userUpdate,
);

// get user whatsapp tasks
router.get(
  '/leads-whatsapp-tasks',
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
  UserController.getUserWhatsappTasks,
);

export const UserRoutes = router;
