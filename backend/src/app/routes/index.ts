import { Router } from 'express';
import { AuthRoutes } from '../modules/Auth/auth.route';
import { UserRoutes } from '../modules/User/user.route';
import { LMUGoalsRoutes } from '../modules/LMU/LMUGoals/lmugoals.route';
import { LMUMultiTaskingRoutes } from '../modules/LMU/LMUMultitasking/lmumultitasking.route';

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
    path: '/lmu-goals',
    route: LMUGoalsRoutes,
  },
  {
    path: '/lmu-multitaskings',
    route: LMUMultiTaskingRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
