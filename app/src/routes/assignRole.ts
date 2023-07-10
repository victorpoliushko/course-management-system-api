import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { RoleModel, RoleName } from '../models/role';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const assignRoleSchema = Joi.object({
  roleName: Joi.string().required()
});

export async function assignRole(req: Request, res: Response) {
  const userId = req.params.id;
  const { roleName } = req.body;

  try {
    const { error } = assignRoleSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ error: error.details[0].message });
    }

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const adminRole = await RoleModel.findOne({ where: { name: RoleName.ADMIN } });
    if (!adminRole) {
      return res.status(403).json({ error: 'Admin role not found' });
    }

    const role = await RoleModel.findOne({ where: { name: roleName } });
    if (!role) {
      return res.status(404).json({ error: 'Role not found' });
    }

    user.roleId = role.id;
    await user.save();

    return res.status(200).json({ message: 'Role assigned successfully' });
  } catch (error) {
    console.error('Error assigning role:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
