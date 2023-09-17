import express from 'express';

import { isAdmin, isStudent, isInstructor } from '../middlewares/role';
import { addCourse, assignCourseInstuctor, assignCoursesStudent, assignLessons, getCourseStudents, getCourses, getLessons, getOwnCourses } from '../services/course';

const courseRouter = express.Router();

courseRouter.get('/', getOwnCourses);
courseRouter.post('/', isInstructor, addCourse);
courseRouter.post('/student', isStudent, assignCoursesStudent);
courseRouter.post('/:courseId/lessons/assign', isInstructor, assignLessons);
courseRouter.post('/:courseId/instuctors/:instructorId', isAdmin, assignCourseInstuctor);
courseRouter.get('/:courseId/students', isInstructor, getCourseStudents);
courseRouter.get('/:courseId/lessons', isStudent, getLessons);

export default courseRouter;
