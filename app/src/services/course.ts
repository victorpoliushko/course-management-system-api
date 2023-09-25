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
import { CourseUser, CourseUserModel } from '../models/courseUser';

const addCourseSchema = Joi.object({
  name: Joi.string().required(),
  lessonIds: Joi.array().items(Joi.string().uuid()).min(5).required(),
  instructorIds: Joi.array().items(Joi.string().uuid()).min(1).required()
});

export async function addCourse(req: Request, res: Response) {
  const { name, lessonIds, instructorIds } = req.body;

  try {
    const { error } = addCourseSchema.validate(req.body);
    if (error) {
      return validationErrorResponse(res, error);
    }
    
    const course = await CourseModel.create({
      id: uuidv4(),
      name,
    });

    for (const instructorId of instructorIds) {
      const instructor = await UserModel.findOne({ where: { id: instructorId } });

      if (!instructor) {
        return res.status(404).json({ error: `User not found` });
      }

      const userRole = await RoleModel.findOne({ where: { id: instructor.roleId } });

      if (userRole?.name !== RoleName.INSTRUCTOR) {
        return res.status(409).json({ error: `User ${instructorId} is not an ${RoleName.INSTRUCTOR}` });
      }

      let courseInstructor: CourseUser;
      const existingCourseInstructor = await CourseUserModel.findOne({ where: { userId: instructorId } });

      if (existingCourseInstructor) {
        existingCourseInstructor.userId = instructorId;
      
        courseInstructor = await existingCourseInstructor.save();
      } else {
        courseInstructor = await CourseUserModel.create({
          id: uuidv4(),
          courseId: course.id,
          userId: instructorId,
          roleId: userRole.id
        });
      }
    }

    for (const id of lessonIds) {
      let lesson = await LessonModel.findByPk(id);
      if (!lesson) {
        return res.status(404).json({ error: `Lesson ${id} not found` });
      }
      lesson.courseId = course.id
      await lesson.save();
    }

    return res.status(200).json({ message: 'Course created successfully' });
  } catch (error) {
    console.error('Error creating course:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const assignInstuctorSchema = Joi.object({
  instructorId: Joi.string().uuid().required(),
  courseId: Joi.string().uuid().required()
});

export async function assignCourseInstuctor(req: Request, res: Response) {
  const instructorId = req.params.instructorId;
  const courseId = req.params.courseId;

  try {
    const { error } = assignInstuctorSchema.validate(req.params);
    if (error) {
      return validationErrorResponse(res, error);
    }

    const user = await UserModel.findByPk(instructorId);
    if (!user) {
      return res.status(404).json({ error: 'Instructor not found' });
    }

    const role = await RoleModel.findOne({
      where: { id: user.roleId },
    });

    if (!role || role.name !== RoleName.INSTRUCTOR) {
      return res.status(404).json({ error: 'User is not an instructor' });
    }

    const course = await CourseModel.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    let courseInstructor: CourseUser;
    const existingCourseInstructor = await CourseUserModel.findOne({ where: { courseId } });

    if (existingCourseInstructor) {
      existingCourseInstructor.userId = instructorId;
    
      courseInstructor = await existingCourseInstructor.save();
    } else {
      courseInstructor = await CourseUserModel.create({
        id: uuidv4(),
        courseId,
        userId: instructorId,
        roleId: role.id
      });
    }

    return res.status(200).json({ message: 'Instructor assigned successfully', courseInstructor });
  } catch (error) {
    console.error('Error assigning instructor:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const assignCoursesStudentSchema = Joi.object({
  courseIds: Joi.array().items(Joi.string().uuid()).max(5).required()
});

export async function assignCoursesStudent(req: Request, res: Response) {
  const courseIds = req.body.courseIds;

  try {
    const { error } = assignCoursesStudentSchema.validate(req.body);
    if (error) {
      return validationErrorResponse(res, error);
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Authentication token not found' });
    }

    const decodedToken = jwt.verify(token, constants.sessionSecret) as { id: string };
    const loggedInUserId = decodedToken.id;

    const user = await UserModel.findByPk(loggedInUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const role = await RoleModel.findOne({
      where: { id: user.roleId },
    });

    if (!role || role.name !== RoleName.STUDENT) {
      return res.status(404).json({ error: 'User is not a student' });
    }

    for (const id of courseIds) {
      const existingCourseStudent = await CourseUserModel.findOne({
        where: { courseId: id, userId: user.id },
      });

      if (existingCourseStudent) {
        continue;
      }

      const studentCoursesCount = await CourseUserModel.count({
        where: { userId: user.id },
      });

      if (studentCoursesCount >= constants.courseLimit) {
        return res.status(400).json({ error: 'Maximum course limit reached' });
      }

      const courseStudent = await CourseUserModel.create({
        id: uuidv4(),
        courseId: id,
        userId: user.id,
        roleId: role.id
      });
  
      if (!courseStudent) {
        return res.status(404).json({ error: 'Course not assigned' });
      }
    }

    return res.status(200).json({ message: 'Course assigned successfully' });
  } catch (error) {
    console.error('Error assigning courses:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const addCourseFeedbackParamsSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  courseId: Joi.string().uuid().required()
});

const addCourseFeedbackBodySchema = Joi.object({
  feedback: Joi.string().required()
});

export async function addCourseFeedback(req: Request, res: Response) {
  const { feedback } = req.body;
  const { studentId, courseId } = req.params;

  try {
    const { error: paramsError } = addCourseFeedbackParamsSchema.validate(req.params);
    const { error: bodyError } = addCourseFeedbackBodySchema.validate(req.body);

    const errors: string[] = [];

    if (paramsError) {
      errors.push(paramsError.details[0].message);
    }

    if (bodyError) {
      errors.push(bodyError.details[0].message);
    }

    if (errors.length > 0) {
      return validationMultipleErrorResponse(res, errors);
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

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Authentication token not found' });
    }

    const decodedToken = jwt.verify(token, constants.sessionSecret) as { id: string };
    const instructorId = decodedToken.id;

    const courseFeedback = await CourseFeedbackModel.create({
      id: uuidv4(),
      instructorId,
      studentId,
      courseId,
      feedback
    });

    return res.status(200).json({ message: 'Course feedback created successfully', courseFeedback });
  } catch (error) {
    console.error('Error adding course feedback:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export async function getOwnCourses(req: Request, res: Response) {
  try {

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Authentication token not found' });
    }

    const decodedToken = jwt.verify(token, constants.sessionSecret) as { id: string };
    const userId = decodedToken.id;

    const user = await UserModel.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const role = await RoleModel.findOne({ where: { id: user.roleId } });

    if (!role) {
      return res.status(404).json({ error: 'User has no role' });
    }

    let userCourses: CourseUser[] | undefined;
    let allCourses: Course[] | undefined;

    switch (role.name) {
      case RoleName.INSTRUCTOR:
        userCourses = await CourseUserModel.findAll({ 
          where: {
            userId: userId, 
          },
          include: [
            {
              model: CourseModel,
              as: 'course',
              include: [
                {
                  model: UserModel,
                  as: 'user',
                },
                {
                  model: LessonModel,
                  as: 'lesson',
                }
              ],
            },
            {
              model: RoleModel,
              as: 'role',
            }
          ]
        });
      break;

      case RoleName.STUDENT:
        userCourses = await CourseUserModel.findAll({ 
          where: {
            userId: userId, 
          },
          include: [
            {
              model: CourseModel,
              as: 'course',
              include: [
                {
                  model: LessonModel,
                  as: 'lesson',
                }
              ],
            }
          ]
        });
      break;

      case RoleName.ADMIN:
        allCourses = await CourseModel.findAll({
          include: [
            {
              model: UserModel,
              as: 'user',
            },
            {
              model: LessonModel,
              as: 'lesson',
            }
          ]
        });
        return res.status(200).json({ allCourses });
    
      default:
        return res.status(404).json({ error: 'No courses for this role' });
    }

    if (!userCourses || userCourses.length <= 0) {
      return res.status(404).json({ error: 'No courses for this user' });
    }

    return res.status(200).json({ userCourses });
  } catch (error) {
    console.error('Error retrieving instructor courses:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getCourseStudentsSchema = Joi.object({
  courseId: Joi.string().uuid().required()
});

export async function getCourseStudents(req: Request, res: Response) {
  try {
    const courseId = req.params.courseId;

    const { error } = getCourseStudentsSchema.validate(req.params);
    if (error) {
      return validationErrorResponse(res, error);
    }

    const studentRole = await RoleModel.findOne({ where: { name: RoleName.STUDENT } });

    if (!studentRole) {
      return res.status(404).json({ error: 'There is no student role' });
    }

    const courseStudents = await CourseUserModel.findAll({
      where: { courseId },
      include: {
        model: UserModel,
        as: 'user',
        where: {
          roleId: studentRole.id
        }
      },
    });

    const students = courseStudents.map((courseStudent) => courseStudent.user);

    return res.status(200).json({ students });
  } catch (error) {
    console.error('Error retrieving instructor courses:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const getLessonsSchema = Joi.object({
  courseId: Joi.string().uuid().required()
});

export async function getLessons(req: Request, res: Response) {
  try {
    const courseId = req.params.courseId;

    const { error } = getLessonsSchema.validate(req.params);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }
    
    const course = await CourseModel.findByPk(courseId, {
      include: [
        {
          model: LessonModel,
          as: 'lesson',
        }
      ],
    });

    return res.status(200).json({ course });
  } catch (error) {
    console.error('Error retrieving course lessons:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

const assignLessonsParamsSchema = Joi.object({
  courseId: Joi.string().uuid().required()
});

const assignLessonsBodySchema = Joi.object({
  lessonIds: Joi.array().items(Joi.string().uuid()).required()
});

export async function assignLessons(req: Request, res: Response) {
  const { error: paramsError } = assignLessonsParamsSchema.validate(req.params);
  const { error: bodyError } = assignLessonsBodySchema.validate(req.body);

  const errors: string[] = [];

  if (paramsError) {
    errors.push(paramsError.details[0].message);
  }

  if (bodyError) {
    errors.push(bodyError.details[0].message);
  }

  if (errors.length > 0) {
    return validationMultipleErrorResponse(res, errors);
  }

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: 'Authentication token not found' });
  }

  const decodedToken = jwt.verify(token, constants.sessionSecret) as { id: string };
  const userId = decodedToken.id;

  try {
    const courseId = req.params.courseId;
    const lessonIds = req.body.lessonIds;

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const course = await CourseModel.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    for (const id of lessonIds) {
      let lesson = await LessonModel.findByPk(id);
      if (!lesson) {
        return res.status(404).json({ error: `Lesson ${id} not found` });
      }

      lesson.courseId = course.id
      await lesson.save();
    }
    
    return res.status(200).json({ message: 'Lessons assigned successfully' });
  } catch (error) {
    console.error('Error assigning lessons:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
