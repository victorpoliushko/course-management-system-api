import express from 'express';
import passport from 'passport';

import { register } from '../services/auth';
import { assignRole } from '../services/user';
import { login, logout } from '../services/auth';
import { isAdmin, isStudent, isInstructor } from '../middlewares/role';
import { addCourse, addCourseFeedback, assignCourseInstuctor, assignCourseStudent, getCourseStudents, getLessons, getOwnCourses } from '../services/course';
import { addMark, getAvgCourseGrade } from '../services/grade';

const router = express.Router();

// auth
router.post('/register', register);
router.post('/login', passport.authenticate('local'), login);
router.get('/logout', logout);

// users
router.post('/users/:userId/role', isAdmin, assignRole);

//courses
router.get('/courses', getOwnCourses);
router.post('/courses', isAdmin, addCourse);
router.post('/courses/:courseId', isStudent, assignCourseStudent);
router.post('/courses/:courseId/instuctors/:instructorId', isAdmin, assignCourseInstuctor);
router.get('/courses/:courseId/students', isInstructor, getCourseStudents);
router.get('/courses/:courseId/lessons', isStudent, getLessons);

//feedback
router.post('/feedback/courses/:courseId/students/:studentId', isInstructor, addCourseFeedback);

//grade
router.post('/grade/student/:studentId/lesson/:lessonId', isInstructor, addMark);
router.get('/grade/student/:studentId/course/:courseId', isInstructor, getAvgCourseGrade);

export default router;
