import express from 'express';

import hasAccessToRoles from '../middlewares/role';
import { addCourse, assignCourseInstuctor, assignCoursesStudent, assignLessons, getCourseStudents, getLessons, getOwnCourses } from '../services/course';
import { RoleName } from '../models/role';

const courseRouter = express.Router();

courseRouter.get('/', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN, RoleName.INSTRUCTOR, RoleName.STUDENT];
  hasAccessToRoles(requiredRoles, req, res, next);
}, getOwnCourses);

courseRouter.post('/', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN, RoleName.INSTRUCTOR];
  hasAccessToRoles(requiredRoles, req, res, next);
}, addCourse);

courseRouter.post('/student', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN, RoleName.STUDENT];
  hasAccessToRoles(requiredRoles, req, res, next);
}, assignCoursesStudent);

courseRouter.post('/:courseId/lessons/assign', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN, RoleName.INSTRUCTOR];
  hasAccessToRoles(requiredRoles, req, res, next);
}, assignLessons);

courseRouter.post('/:courseId/instuctors/:instructorId', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN];
  hasAccessToRoles(requiredRoles, req, res, next);
}, assignCourseInstuctor);

courseRouter.get('/:courseId/students', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN, RoleName.INSTRUCTOR];
  hasAccessToRoles(requiredRoles, req, res, next);
}, getCourseStudents);

courseRouter.get('/:courseId/lessons', (req, res, next) => {
  const requiredRoles = [RoleName.ADMIN, RoleName.INSTRUCTOR, RoleName.STUDENT];
  hasAccessToRoles(requiredRoles, req, res, next);
}, getLessons);

export default courseRouter;
