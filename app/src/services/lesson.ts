import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { RoleModel, RoleName } from '../models/role';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { Course, CourseModel } from '../models/course';
import { LessonModel } from '../models/lesson';
import { v4 as uuidv4 } from 'uuid';
import { CourseFeedbackModel } from '../models/courseFeedback';
import constants from '../config/constants';
import { validationErrorResponse, validationMultipleErrorResponse } from '../utils/error';

const addLessonSchema = Joi.object({
  title: Joi.string().required()
});

export async function addLesson(req: Request, res: Response) {
  const { title } = req.body;

  try {
    const { error } = addLessonSchema.validate(req.body);
    if (error) {
      return validationErrorResponse(res, error);
    }

    const lesson = await LessonModel.create({
      id: uuidv4(),
      title
    });

    await lesson.save();

    return res.status(200).json({ message: 'Lesson created successfully' });
  } catch (error) {
    console.error('Error creating lesson:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
