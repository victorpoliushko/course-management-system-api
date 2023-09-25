import express from 'express';

import { downloadHomework, getHomeworkList, uploadHomework } from '../services/homework';
import { RoleName } from '../models/role';
import hasAccessToRoles from '../middlewares/role';

const homeworkRouter = express.Router();

homeworkRouter.post('/lessons/:lessonId', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN, RoleName.STUDENT];
  hasAccessToRoles(requiredRoles, req, res, next);
}, uploadHomework);

homeworkRouter.get('/', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN, RoleName.INSTRUCTOR];
  hasAccessToRoles(requiredRoles, req, res, next);
}, getHomeworkList);

homeworkRouter.get('/:name', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN, RoleName.INSTRUCTOR];
  hasAccessToRoles(requiredRoles, req, res, next);
}, downloadHomework);

export default homeworkRouter;
