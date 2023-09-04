import express from 'express';

import { isAdmin, isStudent, isInstructor } from '../middlewares/role';
import { addCourse, assignCourseInstuctor, assignCourseStudent, getCourseStudents, getCourses, getLessons, getOwnCourses } from '../services/course';

const courseRouter = express.Router();

courseRouter.get('/', getOwnCourses);
courseRouter.post('/', isAdmin, addCourse);
courseRouter.post('/:courseId', isStudent, assignCourseStudent);
courseRouter.post('/:courseId/instuctors/:instructorId', isAdmin, assignCourseInstuctor);
courseRouter.get('/:courseId/students', isInstructor, getCourseStudents);
courseRouter.get('/:courseId/lessons', isStudent, getLessons);

export default courseRouter;
