import Joi from 'joi';
import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import constants from '../config/constants';

const registrationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export async function register(req: Request, res: Response): Promise<Response> {
  try {
    const { username, password } = req.body;

    // Validate user input
    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    // Check if the username is already taken
    const existingUser = await UserModel.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: 'Username is already taken' });
    }

    // Hash the password
    const hashedPassword = await UserModel.hashPassword(password);

    // Create a new user
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
      roleId: constants.studentId
    });

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('User registration error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
