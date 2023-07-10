import { Association, DataTypes, Model, NonAttribute } from "sequelize";
import sequelize from '../config/database';
import { CourseModel } from './course';
import { UserModel } from './user';

export interface CourseStudent {
  id: string;
  courseId: string;
  studentId: string;

  course?: NonAttribute<CourseStudent[]>;
}

export class CourseStudentModel extends Model<CourseStudent> implements CourseStudent {
  public id: string;
  public courseId: string;
  public studentId: string;

  public course?: NonAttribute<CourseStudent[]>;
  public student?: NonAttribute<CourseStudent[]>;
  public static associations: {
    course: Association<CourseStudentModel, CourseModel>;
    student: Association<CourseStudentModel, UserModel>;
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
        studentId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'course_student',
        tableName: 'course_student',
      }
    );
  }

  public static associate(models: {
    CourseModel: typeof CourseModel,
    UserModel: typeof UserModel
  }): void {
    CourseStudentModel.belongsTo(models.CourseModel, {
      foreignKey: 'courseId',
      as: 'course',
    });

    CourseStudentModel.belongsTo(models.UserModel, {
      foreignKey: 'studentId',
      as: 'student',
    });
  }
}
