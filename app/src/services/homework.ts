import { Request, Response } from 'express';
import Joi from "joi";
import processFile from "../middlewares/upload";
import { format } from "util";
import { Storage } from "@google-cloud/storage";
const storage = new Storage({ keyFilename: "/Users/viktor-poliushko/Documents/promotion-gcp-key/vertical-realm-397409-bb2ffd629d2c.json" });
const bucket = storage.bucket("vp-promotion-homework");

const getFinalCourseGradeSchema = Joi.object({
  studentId: Joi.string().uuid().required(),
  courseId: Joi.string().uuid().required()
});

//@ts-ignore
export async function uploadHomework(req: Request, res: Response) {
  try {
    await processFile(req, res);

    const uploadedFile = req.file as Express.Multer.File;
    if (!uploadedFile) {
      return res.status(400).send({ message: "Please upload a file!" });
    }

    const blob = bucket.file(uploadedFile.originalname);
    const blobStream = blob.createWriteStream({
      resumable: false,
    });

    blobStream.on("error", (err) => {
      res.status(500).send({ message: err.message });
    });

    blobStream.on("finish", async () => {
      const publicUrl = format(
        `https://storage.googleapis.com/${bucket.name}/${blob.name}`
      );

      try {
        await bucket.file(uploadedFile.originalname).makePublic();
        res.status(200).send({
          message: "Uploaded the file successfully: " + uploadedFile.originalname,
          url: publicUrl,
        });
      } catch (err) {
        res.status(500).send({
          message: `Uploaded the file successfully: ${uploadedFile.originalname}, but public access is denied!`,
          url: publicUrl,
        });
      }
    });

    blobStream.end(uploadedFile.buffer);
  } catch (err) {
    res.status(500).send({
      message: `Could not upload the file. ${err}`,
    });
  }
}

export async function getHomeworkList(req: Request, res: Response) {
  try {
    const [files] = await bucket.getFiles();
    const fileInfos: { name: string; url: string | undefined }[] = [];

    files.forEach((file) => {
      fileInfos.push({
        name: file.name,
        url: file.metadata.mediaLink,
      });
    });

    res.status(200).send(fileInfos);
  } catch (err) {
    console.log(err);

    res.status(500).send({
      message: "Unable to read list of files!",
    });
  }
}

//@ts-ignore
export async function downloadHomework(req: Request, res: Response) {
  try {
    const file = bucket.file(req.params.name);

    const [exists] = await file.exists();

    if (!exists) {
      return res.status(404).send({
        message: "File not found.",
      });
    }
    
    const [metaData] = await file.getMetadata();

    if (metaData.mediaLink) {
      res.redirect(metaData.mediaLink);
    } else {
      return res.status(500).send({
        message: "Could not download the file. Media link is undefined.",
      });
    }

  } catch (err) {
    res.status(500).send({
      message: "Could not download the file. " + err,
    });
  }
}
