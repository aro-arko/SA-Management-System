import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { LMUGoalsRoutes } from '../modules/LMU/LMULeadsGoals/lmuleadsgoals.route';
import { LMUMultiTaskingRoutes } from '../modules/LMU/LMUMultitasking/lmumultitasking.route';
import { LeadsManagementRoutes } from '../modules/LMU/LeadsManagement/leads.route';
import { dataManagementRoutes } from '../modules/LMU/DataManagement/datamanagement.route';
import { LMUDataBatchRoutes } from '../modules/LMU/LMUDataBatch/lmudatabatch.route';
import { LMUOthersRoutes } from '../modules/LMU/LMUOthers/lmuothers.route';
import { EMUMultiTaskingRoutes } from '../modules/EMU/EMUMultitasking/emumultitasking.route';
import { FixedTimeEventRoutes } from '../modules/EMU/FixedTimeEvent/fixedtimeevent.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/lmu-leads-goals',
    route: LMUGoalsRoutes,
  },
  {
    path: '/lmu-multitaskings',
    route: LMUMultiTaskingRoutes,
  },
  {
    path: '/leads-management',
    route: LeadsManagementRoutes,
  },
  {
    path: '/data-management',
    route: dataManagementRoutes,
  },
  {
    path: '/lmu-data-batch',
    route: LMUDataBatchRoutes,
  },
  {
    path: '/lmu-others',
    route: LMUOthersRoutes,
  },
  {
    path: '/emu-multitaskings',
    route: EMUMultiTaskingRoutes,
  },
  {
    path: '/fixed-time-events',
    route: FixedTimeEventRoutes,
  },
  {
    path: '/signin-data',
    route: FixedTimeEventRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
