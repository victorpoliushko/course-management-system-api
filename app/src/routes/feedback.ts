import express from 'express';

import { addCourseFeedback } from '../services/course';
import { RoleName } from '../models/role';
import hasAccessToRoles from '../middlewares/role';

const feedbackRouter = express.Router();

feedbackRouter.post('/courses/:courseId/students/:studentId', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN, RoleName.INSTRUCTOR];
  hasAccessToRoles(requiredRoles, req, res, next);
}, addCourseFeedback);

export default feedbackRouter;
