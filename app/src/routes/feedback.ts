import express from 'express';

import { isInstructor } from '../middlewares/role';
import { addCourseFeedback } from '../services/course';

const feedbackRouter = express.Router();

feedbackRouter.post('/courses/:courseId/students/:studentId', isInstructor, addCourseFeedback);

export default feedbackRouter;
