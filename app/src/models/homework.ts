import { Model } from "sequelize";

export class Homework extends Model<Homework> {
  public id!: number;
  public lessonId!: number;
  public studentId!: number;
  public fileName!: string;

  // ...

  static associate(models: any) {
    Homework.belongsTo(models.Lesson, {
      foreignKey: 'lessonId',
      as: 'lesson',
    });
    Homework.belongsTo(models.User, {
      foreignKey: 'studentId',
      as: 'student',
    });
  }
}
