import express from 'express';

import { addLesson } from '../services/lesson';
import { RoleName } from '../models/role';
import hasAccessToRoles from '../middlewares/role';

const lessonRouter = express.Router();

lessonRouter.post('/', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN, RoleName.INSTRUCTOR];
  hasAccessToRoles(requiredRoles, req, res, next);
}, addLesson);

export default lessonRouter;
