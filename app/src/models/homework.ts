import { DataTypes, Model } from "sequelize";

export interface Homework {
  id: string;
  lessonId: string;
  studentId: string;
  fileName: string;
}

export class HomeworkModel extends Model<Homework> implements Homework {
  public id: string;
  public lessonId: string;
  public studentId: string;
  public fileName: string;

  public static initialize(sequelize: any): void {
    this.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        lessonId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        studentId: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        fileName: {
          type: DataTypes.STRING,
          allowNull: false,
        }
      },
      {
        sequelize,
        modelName: 'homework',
        tableName: 'homework'
      }
    );
  }

  static associate(models: any) {
    HomeworkModel.belongsTo(models.LessonModel, {
      foreignKey: 'lessonId',
      as: 'lesson',
    });
    HomeworkModel.belongsTo(models.UserModel, {
      foreignKey: 'studentId',
      as: 'student',
    });
  }
}
