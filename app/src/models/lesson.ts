import { Model } from "sequelize";

export class Lesson extends Model<Lesson> {
  public id!: number;
  public courseId!: number;
  public title!: string;

  // ...

  static associate(models: any) {
    Lesson.belongsTo(models.Course, {
      foreignKey: 'courseId',
      as: 'course',
    });
    Lesson.hasMany(models.Grade, {
      foreignKey: 'lessonId',
      as: 'grades',
    });
  }
}
