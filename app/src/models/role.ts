import { DataTypes, Model } from "sequelize";

export enum RoleName {
  ADMIN = 'admin',
  INSTRUCTOR = 'instructor',
  STUDENT = 'student'
}

export interface Role {
  id: string;
  name: string;
}

export class RoleModel extends Model implements Role {
  public id: string;
  public name: string;

  public static initialize(sequelize: any): void {
    this.init(
      {
        id: {
          type: DataTypes.STRING,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        }
      },
      {
        sequelize,
        modelName: 'role',
        tableName: 'role'
      }
    );
  }

  static associate(models: any) {
    RoleModel.hasMany(models.UserModel, {
      foreignKey: 'roleId',
      as: 'user',
    });
  }
}
