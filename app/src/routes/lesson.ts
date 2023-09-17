import express from 'express';

import { isInstructor } from '../middlewares/role';
import { addLesson } from '../services/lesson';

const lessonRouter = express.Router();

lessonRouter.post('/', isInstructor, addLesson);

export default lessonRouter;
