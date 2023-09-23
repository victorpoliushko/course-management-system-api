import express from 'express';

import { isInstructor, isStudent } from '../middlewares/role';
import { addCourseFeedback } from '../services/course';
import { downloadHomework, getHomeworkList, uploadHomework } from '../services/homework';

const homeworkRouter = express.Router();

homeworkRouter.post('/lessons/:lessonId', isStudent, uploadHomework);
homeworkRouter.get('/', isInstructor, getHomeworkList);
homeworkRouter.get('/:name', isInstructor, downloadHomework);

export default homeworkRouter;
