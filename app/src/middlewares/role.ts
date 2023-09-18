import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RoleModel, RoleName } from '../models/role';
import { UserModel } from '../models/user';
import constants from '../config/constants';

async function verifyRole(roleName: RoleName, req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
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

    const role = await RoleModel.findOne({ where: { name: roleName } });
    if (!role) {
      return res.status(403).json({ error: `${roleName} role not found` });
    }

    const adminRole = await RoleModel.findOne({ where: { name: RoleName.ADMIN } });
    if (!adminRole) {
      return res.status(403).json({ error: `${adminRole} role not found` });
    }
    
    if (user.roleId === adminRole.id || user.roleId === role.id) {
      next();
    } else {
      return res.status(403).json({ error: `User does not have premissions` });
    }
  } catch (error) {
    console.error(`Error verifying premissions:`, error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const isAdmin = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  return verifyRole(RoleName.ADMIN, req, res, next);
};

export const isInstructor = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  return verifyRole(RoleName.INSTRUCTOR, req, res, next);
};

export const isStudent = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  return verifyRole(RoleName.STUDENT, req, res, next);
};
