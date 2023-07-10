import { Association, DataTypes, Model, NonAttribute } from "sequelize";
import { LessonModel } from "./lesson";
import { UserModel } from "./user";

export interface Course {
  id: string;
  name: string;
}

export class CourseModel extends Model<Course> implements Course {
  public id: string;
  public name: string;

  public lesson?: LessonModel[];
  public static associations: {
    lesson: Association<CourseModel, LessonModel>;
    instructor: Association<CourseModel, UserModel>; 
    student: Association<CourseModel, UserModel>; 
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
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        }
      },
      {
        sequelize,
        modelName: 'course',
        tableName: 'course'
      }
    );
  }

  static associate(models: any) {
    CourseModel.belongsToMany(models.UserModel, {
      through: 'course_instructor',
      foreignKey: 'courseId',
      as: 'instructor',
    });
    CourseModel.belongsToMany(models.UserModel, {
      through: 'course_student',
      foreignKey: 'courseId',
      as: 'student',
    });
    CourseModel.hasMany(models.LessonModel, {
      foreignKey: 'courseId',
      as: 'lesson',
    });
  }
}
