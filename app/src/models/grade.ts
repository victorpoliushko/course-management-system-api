import { Model } from "sequelize";

export class Grade extends Model<Grade> {
  public id!: number;
  public lessonId!: number;
  public studentId!: number;
  public mark!: number;

  // ...

  static associate(models: any) {
    Grade.belongsTo(models.Lesson, {
      foreignKey: 'lessonId',
      as: 'lesson',
    });
    Grade.belongsTo(models.User, {
      foreignKey: 'studentId',
      as: 'student',
    });
  }
}
