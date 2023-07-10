import { DataTypes, Model } from "sequelize";

export interface Lesson {
  id: string;
  courseId?: string;
  title: string;
}

export class LessonModel extends Model<Lesson> implements Lesson {
  public id: string;
  public courseId?: string;
  public title: string;

  public static initialize(sequelize: any): void {
    this.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        courseId: {
          type: DataTypes.STRING,
          allowNull: true,
        }
      },
      {
        sequelize,
        modelName: 'lesson',
        tableName: 'lesson'
      }
    );
  }

  static associate(models: any) {
    LessonModel.belongsTo(models.CourseModel, {
      foreignKey: 'courseId',
      as: 'course',
    });
    LessonModel.hasMany(models.GradeModel, {
      foreignKey: 'lessonId',
      as: 'grade',
    });
  }
}
