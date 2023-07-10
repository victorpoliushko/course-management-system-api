import express from 'express';
import { register } from './register';
import { assignRole } from './assignRole';
import { isAdmin, isInstructor, isStudent, login, logout } from './auth';
import passport from 'passport';
import { addCourse, addCourseFeedback, assignCourseInstuctor, assignCourseStudent, getCourseStudents, getLessons, getOwnCourses } from './course';
import { addMark, getAvgCourseGrade } from './grade';

const router = express.Router();

router.post('/register', register);
router.post('/login', passport.authenticate('local'), login);
router.get('/logout', logout);
router.post('/user/:id/role', isAdmin, assignRole);
router.post('/course/:courseId/instuctor/:instructorId', isAdmin, assignCourseInstuctor);
router.get('/courses', getOwnCourses);
router.post('/courses', isAdmin, addCourse);
router.post('/courses/:courseId', assignCourseStudent);
router.post('/feedback/courses/:courseId/students/:studentId', isInstructor, addCourseFeedback);
router.post('/grade/student/:studentId/lesson/:lessonId', isInstructor, addMark);
router.get('/grade/student/:studentId/course/:courseId', isInstructor, getAvgCourseGrade);
router.get('/courses/:courseId/students', isInstructor, getCourseStudents);
router.get('/courses/:courseId/lessons', isStudent, getLessons);


export default router;
