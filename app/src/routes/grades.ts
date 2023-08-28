import express from 'express';

import { isInstructor } from '../middlewares/role';
import { addMark, getAvgCourseGrade } from '../services/grade';

const router = express.Router();

router.post('/grades/student/:studentId/lesson/:lessonId', isInstructor, addMark);
router.get('/grades/student/:studentId/course/:courseId', isInstructor, getAvgCourseGrade);

export default router;
