import express from 'express';

import { isInstructor } from '../middlewares/role';
import { addMark, getAvgCourseGrade } from '../services/grade';

const gradesRouter = express.Router();

gradesRouter.post('/student/:studentId/lesson/:lessonId', isInstructor, addMark);
gradesRouter.get('/student/:studentId/course/:courseId', isInstructor, getAvgCourseGrade);

export default gradesRouter;
