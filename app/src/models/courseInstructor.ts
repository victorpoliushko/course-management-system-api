import { Association, DataTypes, Model, NonAttribute } from "sequelize";
import sequelize from '../config/database';
import { CourseModel } from './course';
import { UserModel } from './user';

export interface CourseInstructor {
  id: string;
  courseId: string;
  instructorId: string;

  course?: NonAttribute<CourseInstructor[]>;
}

export class CourseInstructorModel extends Model<CourseInstructor> implements CourseInstructor {
  public id: string;
  public courseId: string;
  public instructorId: string;

  public course?: NonAttribute<CourseInstructor[]>;
  public instructor?: NonAttribute<CourseInstructor[]>
  public static associations: {
    course: Association<CourseInstructorModel, CourseModel>;
    instructor: Association<CourseInstructorModel, UserModel>;
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
        instructorId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'course_instructor',
        tableName: 'course_instructor',
      }
    );
  }

  public static associate(models: {
    CourseModel: typeof CourseModel,
    UserModel: typeof UserModel
  }): void {
    CourseInstructorModel.belongsTo(models.CourseModel, {
      foreignKey: 'courseId',
      as: 'course',
    });

    CourseInstructorModel.belongsTo(models.UserModel, {
      foreignKey: 'instructorId',
      as: 'instructor',
    });
  }
}
