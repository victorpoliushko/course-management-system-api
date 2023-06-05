import { Model } from "sequelize";

export class User extends Model<User> {
  public id!: number;
  public username!: string;
  public password!: string;
  public roleId!: number;

  // ...

  static associate(models: any) {
    User.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });
    User.belongsToMany(models.Course, {
      through: 'course_instructors',
      foreignKey: 'instructorId',
      as: 'instructorCourses',
    });
  }
}
