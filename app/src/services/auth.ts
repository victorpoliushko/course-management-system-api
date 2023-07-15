import passport from 'passport';
import { Request, Response } from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import { User, UserModel } from '../models/user';
import Joi from 'joi';
import constants from '../config/constants';
import { validationErrorResponse } from '../utils/error';

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await UserModel.findOne({ where: { username: username } });
      if (!user || !(await user.validatePassword(password))) {
        return done(null, false, { message: 'Invalid username or password' });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  try {
    const user = await UserModel.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

export async function login(req: Request, res: Response) {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return validationErrorResponse(res, error);
  }

  if (req.user) {
    const user = req.user as User;

    const token = jwt.sign({ id: user.id }, 'your-secret-key');

    res.cookie('token', token, { httpOnly: true });

    return res.sendStatus(200);
  }

  return res.status(401).json({ error: 'Authentication failed' });
}

export async function logout(req: Request, res: Response) {
  req.logout((err): Response | void => {
    if (err) {
      console.error('Logout error:', err);
      return res.sendStatus(500);
    }
    res.clearCookie('token');

    res.sendStatus(200);
  });
}


const registrationSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

export async function register(req: Request, res: Response): Promise<Response> {
  try {
    const { username, password } = req.body;

    const { error } = registrationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const existingUser = await UserModel.findOne({ where: { username } });
    if (existingUser) {
      return res.status(409).json({ error: 'Username is already taken' });
    }

    const hashedPassword = await UserModel.hashPassword(password);

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
