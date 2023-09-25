import { Response } from "express";
import Joi from "joi";

export function validationErrorResponse(res: Response, error: Joi.ValidationError): Response {
  return res.status(400).json({ error: error.details[0].message });
}

export function validationMultipleErrorResponse(res: Response, errors: string[]): Response {
  return res.status(400).json({ errors });
}
