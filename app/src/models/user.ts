import { Model, DataTypes, Association } from 'sequelize';
import bcrypt from 'bcryptjs';
import sequelize from '../config/database';
import { CourseModel } from './course';
import { RoleModel } from './role';

export interface User {
  id: string;
  username: string;
  password: string;
  roleId: string;
}

export class UserModel extends Model implements User {
  public id: string;
  public username: string;
  public password: string;
  public roleId: string;

  public role: RoleModel;

  public static associations: {
    role: Association<UserModel, RoleModel>;
  };

  public static async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  public async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  public static initialize(sequelize: any): void {
    this.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        username: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        password: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        roleId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'user',
        tableName: 'user'
      }
    );
  }

  public static associate(models: any) {
    UserModel.belongsTo(models.RoleModel, {
      foreignKey: 'roleId',
      as: 'role',
    });

    UserModel.belongsToMany(models.CourseModel, {
      through: 'course_user',
      foreignKey: 'userId',
      as: 'courseUser',
    });
    
    UserModel.belongsToMany(models.CourseModel, {
      through: 'course_student',
      foreignKey: 'studentId',
      as: 'courseStudent',
    });
  }
}
