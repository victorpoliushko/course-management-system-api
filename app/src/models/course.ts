import { Model } from "sequelize";

export class Course extends Model<Course> {
  public id!: number;
  public name!: string;
  public instructorId!: number;

  // ...

  static associate(models: any) {
    Course.belongsToMany(models.User, {
      through: 'course_instructors',
      foreignKey: 'courseId',
      as: 'instructors',
    });
    Course.hasMany(models.Lesson, {
      foreignKey: 'courseId',
      as: 'lessons',
    });
  }
}
