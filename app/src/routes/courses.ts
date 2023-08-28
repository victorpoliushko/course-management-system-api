import express from 'express';

import { isAdmin, isStudent, isInstructor } from '../middlewares/role';
import { addCourse, assignCourseInstuctor, assignCourseStudent, getCourseStudents, getCourses, getLessons, getOwnCourses } from '../services/course';

const router = express.Router();

router.get('/courses', getOwnCourses);
router.post('/courses', isAdmin, addCourse);
router.post('/courses/:courseId', isStudent, assignCourseStudent);
router.post('/courses/:courseId/instuctors/:instructorId', isAdmin, assignCourseInstuctor);
router.get('/courses/:courseId/students', isInstructor, getCourseStudents);
router.get('/courses/:courseId/lessons', isStudent, getLessons);

export default router;
