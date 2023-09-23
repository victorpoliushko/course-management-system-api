import { Association, DataTypes, Model, NonAttribute } from "sequelize";
import { CourseModel } from './course';
import { UserModel } from './user';
import { RoleModel } from "./role";

export interface CourseUser {
  id: string;
  courseId: string;
  userId: string;
  roleId: string;
  passed?: boolean;

  course?: NonAttribute<CourseUser[]>;
  user?: NonAttribute<CourseUser[]>;
  role?: NonAttribute<CourseUser[]>;
}

export class CourseUserModel extends Model<CourseUser> implements CourseUser {
  public id: string;
  public courseId: string;
  public userId: string;
  public roleId: string;
  public passed?: boolean;

  public course?: NonAttribute<CourseUser[]>;
  public user?: NonAttribute<CourseUser[]>;
  public role?: NonAttribute<CourseUser[]>;
  public static associations: {
    course: Association<CourseUserModel, CourseModel>;
    user: Association<CourseUserModel, UserModel>;
    role: Association<CourseUserModel, RoleModel>;
  };

  public static initialize(sequelize: any): void {
    this.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        courseId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        userId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        roleId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        passed: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
      },
      {
        sequelize,
        modelName: 'course_user',
        tableName: 'course_user',
      }
    );
  }

  public static associate(models: {
    CourseModel: typeof CourseModel,
    UserModel: typeof UserModel
    RoleModel: typeof RoleModel,
  }): void {
    CourseUserModel.belongsTo(models.CourseModel, {
      foreignKey: 'courseId',
      as: 'course',
    });

    CourseUserModel.belongsTo(models.UserModel, {
      foreignKey: 'userId',
      as: 'user',
    });

    CourseUserModel.belongsTo(models.RoleModel, {
      foreignKey: 'roleId',
      as: 'role',
    });
  }
}
