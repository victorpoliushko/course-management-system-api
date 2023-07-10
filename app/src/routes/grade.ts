import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { RoleModel, RoleName } from '../models/role';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { CourseModel } from '../models/course';
import { CourseInstructorModel } from '../models/courseInstructor';
import { LessonModel } from '../models/lesson';
import { v4 as uuidv4 } from 'uuid';
import { CourseStudentModel } from '../models/courseStudent';
import { GradeModel } from '../models/grade';

const addMarkSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  lessonId: Joi.string().uuid().required()
});

const addMarkSchemaParams = Joi.object({
  mark: Joi.number().required()
});

export async function addMark(req: Request, res: Response) {
  const { mark } = req.body;
  const { studentId, lessonId } = req.params;

  try {
    const { error: bodyError } = addMarkSchema.validate(req.params);
    const { error: paramsError } = addMarkSchemaParams.validate(req.body);

    const errors: string[] = [];

    if (bodyError) {
      errors.push(bodyError.details[0].message);
    }

    if (paramsError) {
      errors.push(paramsError.details[0].message);
    }

    if (errors.length > 0) {
      return res.status(400).json({ errors });
    }

    const user = await UserModel.findByPk(studentId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const role = await RoleModel.findOne({
      where: { id: user.roleId },
    });

    if (!role || role.name !== RoleName.STUDENT) {
      return res.status(404).json({ error: 'User is not a student' });
    }

    const grade = await GradeModel.create({
      id: uuidv4(),
      lessonId,
      studentId,
      mark
    });

    return res.status(200).json({ message: 'Grade created successfully' });
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getAvgCourseGradeSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  courseId: Joi.string().uuid().required()
});

export async function getAvgCourseGrade(req: Request, res: Response) {
  const { studentId, courseId } = req.params;

  try {
    const { error } = getAvgCourseGradeSchema.validate(req.params);

    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    const user = await UserModel.findByPk(studentId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const role = await RoleModel.findOne({
      where: { id: user.roleId },
    });

    if (!role || role.name !== RoleName.STUDENT) {
      return res.status(404).json({ error: 'User is not a student' });
    }

    const studentCourse = await CourseStudentModel.count({
      where: { courseId, studentId },
    });

    if (!studentCourse) {
      return res.status(404).json({ error: 'User is not a student of this course' });
    }

    const lessons = await LessonModel.findAll({ where: { courseId } });

    if (!lessons) {
      return res.status(404).json({ error: 'Lessons not found' });
    }

    let totalAvgStudentLessonMarks: number[] = [];

    for (const lesson of lessons) {
      const grades = await GradeModel.findAll({ where: { lessonId: lesson.id, studentId } });
      const avgStudentLessonMark = grades.reduce((sum, grade) => sum + grade.mark, 0) / grades.length;

      totalAvgStudentLessonMarks.push(avgStudentLessonMark);
    }

    const avgCourseGrade = totalAvgStudentLessonMarks.reduce((sum, mark) => sum + mark, 0) / totalAvgStudentLessonMarks.length;

    return res.status(200).json({ message: 'Average course grade', avgCourseGrade });
  } catch (error) {
    console.error('Error calculating average course grade:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
