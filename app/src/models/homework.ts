import { Model } from "sequelize";

export interface Homework {
  id: string;
  lessonId: string;
  studentId: string;
  fileName: string;
}

export class HomeworkModel extends Model<HomeworkModel> implements Homework {
  public id: string;
  public lessonId: string;
  public studentId: string;
  public fileName: string;

  // ...

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
