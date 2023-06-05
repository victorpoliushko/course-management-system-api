import { Model } from "sequelize";

export class Role extends Model<Role> {
  public id!: number;
  public name!: string;

  // ...

  static associate(models: any) {
    Role.hasMany(models.User, {
      foreignKey: 'roleId',
      as: 'users',
    });
  }
}
