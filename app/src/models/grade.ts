import { DataTypes, Model } from "sequelize";

export interface Grade {
  id: string;
  lessonId: string;
  studentId: string;
  mark: number;
}

export class GradeModel extends Model<Grade> implements Grade {
  public id: string;
  public lessonId: string;
  public studentId: string;
  public mark: number;

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
        mark: {
          type: DataTypes.INTEGER,
          allowNull: false,
        },
      },
      {
        sequelize,
        modelName: 'grade',
        tableName: 'grade'
      }
    );
  }

  static associate(models: any) {
    GradeModel.belongsTo(models.LessonModel, {
      foreignKey: 'lessonId',
      as: 'lesson',
    });
    GradeModel.belongsTo(models.UserModel, {
      foreignKey: 'studentId',
      as: 'student',
    });
  }
}
