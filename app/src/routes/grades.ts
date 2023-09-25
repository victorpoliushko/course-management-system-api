import express from 'express';

import { addMark, getFinalCourseGrade } from '../services/grade';
import { RoleName } from '../models/role';
import hasAccessToRoles from '../middlewares/role';

const gradesRouter = express.Router();

gradesRouter.post('/student/:studentId/lesson/:lessonId', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN, RoleName.INSTRUCTOR];
  hasAccessToRoles(requiredRoles, req, res, next);
}, addMark);

gradesRouter.get('/student/:studentId/course/:courseId', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN, RoleName.INSTRUCTOR, RoleName.STUDENT];
  hasAccessToRoles(requiredRoles, req, res, next);
}, getFinalCourseGrade);

export default gradesRouter;
