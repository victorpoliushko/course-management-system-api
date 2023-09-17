import express from 'express';

import { isInstructor } from '../middlewares/role';
import { addMark, getFinalCourseGrade } from '../services/grade';

const gradesRouter = express.Router();

gradesRouter.post('/student/:studentId/lesson/:lessonId', isInstructor, addMark);
gradesRouter.get('/student/:studentId/course/:courseId', isInstructor, getFinalCourseGrade);

export default gradesRouter;
