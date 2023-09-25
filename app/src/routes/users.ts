import express from 'express';

import { assignRole } from '../services/user';
import { RoleName } from '../models/role';
import hasAccessToRoles from '../middlewares/role';

const usersRouter = express.Router();

usersRouter.post('/:userId/role', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN];
  hasAccessToRoles(requiredRoles, req, res, next);
}, assignRole);

export default usersRouter;
