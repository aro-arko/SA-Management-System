import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { LMUGoalsRoutes } from '../modules/LMU/LMULeadsGoals/lmuleadsgoals.route';
import { LMUMultiTaskingRoutes } from '../modules/LMU/LMUMultitasking/lmumultitasking.route';
import { LeadsManagementRoutes } from '../modules/LMU/LeadsManagement/leads.route';
import { dataManagementRoutes } from '../modules/LMU/DataManagement/datamanagement.route';

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
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
