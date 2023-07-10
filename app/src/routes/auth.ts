import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import session from 'express-session';
import SequelizeStore from 'connect-session-sequelize';
import { User, UserModel } from '../models/user';
import app from '../index';
import sequelize from 'src/config/database';
import { RoleModel, RoleName } from '../models/role';
import Joi from 'joi';

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().min(6).required(),
});

// Configure passport to use local strategy
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

// Set up the routes for authentication and authorization
// app.post('/login', passport.authenticate('local'), (req: Request, res: Response) => {
export async function login(req: Request, res: Response) {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  if (req.user) {
    const user = req.user as User; // Assert req.user as User type

    // Generate a JWT token
    const token = jwt.sign({ id: user.id }, 'your-secret-key');

    // Set the token as a cookie
    res.cookie('token', token, { httpOnly: true });

    // Send a success response
    return res.sendStatus(200);
  }

  // Handle the case where req.user is undefined
  return res.status(401).json({ error: 'Authentication failed' });
}

export async function logout(req: Request, res: Response) {
  // Destroy the session and remove the token cookie
  req.logout((err): Response | void => {
    if (err) {
      // Handle any error that occurred during logout
      console.error('Logout error:', err);
      return res.sendStatus(500);
    }
    res.clearCookie('token');
    // Send a success response
    res.sendStatus(200);
  });
}

// Middleware to verify the token and authenticate the user
export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  // Get the token from the cookie
  const token = req.cookies.token;

  if (token) {
    // Verify the token
    jwt.verify(token, 'your-secret-key', (err: any, decoded: any): Response | void => {
      if (err) {
        // Token verification failed
        return res.sendStatus(401);
      }

      // Token is valid, authenticate the user
      req.user = { id: decoded.id };
      next();
    });
  } else {
    // Token not found in the cookie
    res.sendStatus(401);
  }
};


export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    // Get the token from the cookie
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Authentication token not found' });
    }

    // Verify and decode the token
    const decodedToken = jwt.verify(token, 'your-secret-key') as { id: string };
    const loggedInUserId = decodedToken.id;

    // Retrieve the user from the database
    const user = await UserModel.findByPk(loggedInUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Retrieve the admin role from the database
    const adminRole = await RoleModel.findOne({ where: { name: RoleName.ADMIN } });
    if (!adminRole) {
      return res.status(403).json({ error: 'Admin role not found' });
    }

    // Check if the user has the admin role
    if (user.roleId !== adminRole.id) {
      return res.status(403).json({ error: 'User does not have admin role' });
    }

    // User has admin role, proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error verifying admin role:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const isInstructor = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Authentication token not found' });
    }

    const decodedToken = jwt.verify(token, 'your-secret-key') as { id: string };
    const loggedInUserId = decodedToken.id;

    const user = await UserModel.findByPk(loggedInUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const instructorRole = await RoleModel.findOne({ where: { name: RoleName.INSTRUCTOR } });
    if (!instructorRole) {
      return res.status(403).json({ error: 'Instructor role not found' });
    }

    if (user.roleId !== instructorRole.id) {
      return res.status(403).json({ error: 'User does not have instructor role' });
    }

    next();
  } catch (error) {
    console.error('Error verifying instructor role:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};


export const isStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ error: 'Authentication token not found' });
    }

    const decodedToken = jwt.verify(token, 'your-secret-key') as { id: string };
    const loggedInUserId = decodedToken.id;

    const user = await UserModel.findByPk(loggedInUserId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const studentRole = await RoleModel.findOne({ where: { name: RoleName.STUDENT } });
    if (!studentRole) {
      return res.status(403).json({ error: 'Student role not found' });
    }

    if (user.roleId !== studentRole.id) {
      return res.status(403).json({ error: 'User does not have stundent role' });
    }

    next();
  } catch (error) {
    console.error('Error verifying stundent role:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
