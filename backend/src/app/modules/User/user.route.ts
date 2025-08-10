import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { UserController } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

// get me
router.get(
  '/me',
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
  UserController.getMe,
);

// update own profile
router.patch(
  '/update/me',
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
  validateRequest(UserValidation.updateOwnProfileValidation),
  UserController.updateOwnProfile,
);

// get user details by id
router.get(
  '/details/:userId',
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
  UserController.getUserDetailsById,
);
router.get(
  '/tasks',
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
  UserController.getUserTasks,
);

router.get(
  '/tasks/:taskId',
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
  UserController.getTaskDetails,
);

router.get(
  '/',
  auth(
    USER_ROLE.coordinator,
    USER_ROLE.head,
    USER_ROLE.lmuAdmin,
    USER_ROLE.lmuDataLeader,
    USER_ROLE.dsmmAdmin,
    USER_ROLE.hrFinanceAdmin,
  ),
  UserController.getAllUsers,
);

// user update by admin
router.patch(
  '/update/:id',
  auth(USER_ROLE.coordinator, USER_ROLE.head),
  validateRequest(UserValidation.userUpdateValidation),
  UserController.userUpdate,
);

// extracting user name by ID
router.get(
  '/:userId',
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
  UserController.getUserById,
);

export const UserRoutes = router;
