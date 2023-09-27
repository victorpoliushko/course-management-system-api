import { DataTypes, Model } from "sequelize";

export interface CourseFeedback {
  id: string;
  courseId: string;
  studentId: string;
  instructorId: string;
  feedback: string;
}

export class CourseFeedbackModel extends Model<CourseFeedback> implements CourseFeedback {
  public id: string;
  public courseId: string;
  public studentId: string;
  public instructorId: string;
  public feedback: string;

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
        instructorId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        feedback: {
          type: DataTypes.TEXT,
          allowNull: false
        }
      },
      {
        sequelize,
        modelName: 'course_feedback',
        tableName: 'course_feedback',
      }
    );
  }

  public static associate(models: any) {
    CourseFeedbackModel.belongsTo(models.CourseModel, {
      foreignKey: 'courseId',
      as: 'course',
    });

    CourseFeedbackModel.belongsTo(models.UserModel, {
      foreignKey: 'studentId',
      as: 'student',
    });

    CourseFeedbackModel.belongsTo(models.UserModel, {
      foreignKey: 'instructorId',
      as: 'instructor',
    });
  }
}
