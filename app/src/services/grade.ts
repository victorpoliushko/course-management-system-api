import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { RoleModel, RoleName } from '../models/role';
import Joi from 'joi';
import jwt from 'jsonwebtoken';
import { LessonModel } from '../models/lesson';
import { v4 as uuidv4 } from 'uuid';
import { Grade, GradeModel } from '../models/grade';
import { validationErrorResponse, validationMultipleErrorResponse } from '../utils/error';
import constants from '../config/constants';
import { CourseUserModel } from '../models/courseUser';
import { CourseModel } from '../models/course';

const addMarkSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  lessonId: Joi.string().uuid().required()
});

const addMarkSchemaParams = Joi.object({
  mark: Joi.number().required().max(100)
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
      return validationMultipleErrorResponse(res, errors);
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Authentication token not found' });
    }

    const decodedToken = jwt.verify(token, constants.sessionSecret) as { id: string };
    const loggedInUserId = decodedToken.id;

    const instructor = await UserModel.findByPk(loggedInUserId);
    if (!instructor) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    const student = await UserModel.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    const role = await RoleModel.findOne({
      where: { id: student.roleId },
    });

    if (!role || role.name !== RoleName.STUDENT) {
      return res.status(404).json({ error: 'User is not a student' });
    }

    const lesson = await LessonModel.findByPk(lessonId);

    if (!lesson) {
      return res.status(404).json({ error: 'User is not assigned to this lesson' });
    }

    const course = await CourseModel.findByPk(lesson.courseId);

    if (!course) {
      return res.status(404).json({ error: 'This lesson does not have a course' });
    }

    const courseStudents = await CourseUserModel.findAll({ where: { userId: studentId }})

    const courseStudentLessonAssigned = courseStudents.find(courseStudent => courseStudent.courseId === lesson.courseId);

    if (!courseStudentLessonAssigned) {
      return res.status(404).json({ error: 'Student is not assigned to a course with this lesson' });
    }

    const courseInstructors = await CourseUserModel.findAll({ where: { userId: loggedInUserId }})

    const courseInstructorLessonAssigned = courseInstructors.find(courseInstructor => courseInstructor.courseId === lesson.courseId);

    if (!courseInstructorLessonAssigned) {
      return res.status(404).json({ error: 'Instructor is not assigned to a course with this lesson' });
    }

    let grade: Grade;

    grade = await GradeModel.create({
      id: uuidv4(),
      lessonId,
      studentId,
      mark
    });
   
    return res.status(200).json({ message: `Grade assigned successfully ${grade.mark} `});
  } catch (error) {
    console.error('Error assigning grade:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getFinalCourseGradeSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  courseId: Joi.string().uuid().required()
});

export async function getFinalCourseGrade(req: Request, res: Response) {
  const { studentId, courseId } = req.params;

  try {
    const { error } = getFinalCourseGradeSchema.validate(req.params);

    if (error) {
      return validationErrorResponse(res, error);
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

    const studentCourse = await CourseUserModel.findOne({
      where: { courseId, userId: studentId },
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
      if (grades.length <= 0) {
        return res.status(404).json({ error: 'Can not calculate average grade. Please add grades to each lesson' });
      }

      const avgStudentLessonMark = grades.reduce((sum, grade) => sum + grade.mark, 0) / grades.length;
      totalAvgStudentLessonMarks.push(avgStudentLessonMark);
    }

    const avgCourseGrade = Math.round(totalAvgStudentLessonMarks.reduce((sum, mark) => sum + mark, 0) / totalAvgStudentLessonMarks.length);

    if (avgCourseGrade >= constants.minRequiredGrade) {
      await studentCourse.update({ passed: true });
      return res.status(200).json({ message: 'Course passed', avgCourseGrade });
    } 
    await studentCourse.update({ passed: false });
    return res.status(200).json({ message: 'Course NOT passed', avgCourseGrade });
  } catch (error) {
    console.error('Error calculating average course grade:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
