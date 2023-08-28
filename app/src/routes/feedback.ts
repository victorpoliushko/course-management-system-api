import express from 'express';

import { isInstructor } from '../middlewares/role';
import { addCourseFeedback } from '../services/course';

const router = express.Router();

router.post('/feedbacks/courses/:courseId/students/:studentId', isInstructor, addCourseFeedback);

export default router;
