import { Request, Response } from 'express';
import Joi from "joi";
import multer from "multer";
import { HomeworkModel } from '../models/homework';
import { v4 as uuidv4 } from 'uuid';


const getFinalCourseGradeSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  courseId: Joi.string().uuid().required()
});

export async function uploadHomework(req: Request, res: Response) {
// const upload = multer({ storage: multer.memoryStorage() });

//   try {
//     if (!req.file) {
//       return res.status(400).send('No file uploaded.');
//     }

//     const { studentId, lessonId } = req.body;
//     const fileName = req.file.originalname;

//     const homework = await HomeworkModel.create({ 
//       id: uuidv4(), 
//       studentId, 
//       lessonId, 
//       fileName
//     });

//     return res.status(200).send('File uploaded successfully.');
//   } catch (error) {
//     console.error('Error uploading homework:', error);
//     return res.status(500).send('Internal server error.');
//   }
const upload = multer({
  storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, "uploads")
      },
      filename: (req, file, cb) => {
        cb(
            null,
            file.fieldname + "-" + Date.now() + "-" + file.originalname
        )
    }
  }),
  fileFilter: (req, file, cb) => {
      if (
          file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ) {
          cb(null, true)
      } else {
          cb(null, false)
          return cb(new Error("Only .docx format allowed!"))
      }
    }
  })

}
