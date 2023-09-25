import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { RoleModel, RoleName } from '../models/role';
import { UserModel } from '../models/user';
import constants from '../config/constants';

async function hasAccessToRoles(requiredRoles: RoleName[], req: Request, res: Response, next: NextFunction): Promise<Response | void> {
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

    const roles = await RoleModel.findAll({ where: { name: requiredRoles } });
    if (roles.length === 0) {
      return res.status(403).json({ error: 'Required role not found' });
    }

    if (roles.some((role) => user.roleId === role.id)) {
      next();
    } else {
      return res.status(403).json({ error: 'User does not have permissions' });
    }
  } catch (error) {
    console.error('Error verifying permissions:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export default hasAccessToRoles;
