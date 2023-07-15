import { Request, Response } from 'express';
import { UserModel } from '../models/user';
import { RoleModel, RoleName } from '../models/role';
import Joi from 'joi';

const assignRoleParamsSchema = Joi.object({
  userId: Joi.string().required().uuid()
});

const assignRoleBodySchema = Joi.object({
  roleName: Joi.string().required().valid(RoleName.STUDENT, RoleName.INSTRUCTOR, RoleName.ADMIN)
});

export async function assignRole(req: Request, res: Response): Promise<Response> {
  const userId = req.params.userId;
  const { roleName } = req.body;

  try {
    const { error: paramsError } = assignRoleParamsSchema.validate(req.params);
    const { error: bodyError } = assignRoleBodySchema.validate(req.body);

    if (paramsError || bodyError) {
      const errors: string[] = [];
      if (paramsError) {
        errors.push(paramsError.details[0].message);
      }
      if (bodyError) {
        errors.push(bodyError.details[0].message);
      }
      throw new Error(errors.join(', '));
    }

    const user = await UserModel.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
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
