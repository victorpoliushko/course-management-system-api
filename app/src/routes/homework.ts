import express from 'express';

import { isInstructor } from '../middlewares/role';
import { addCourseFeedback } from '../services/course';
import { uploadHomework } from '../services/homework';

const homeworkRouter = express.Router();

homeworkRouter.post('/students/:studentId/lessons/:lessonId', isInstructor, uploadHomework);

export default homeworkRouter;
