import express, { Express, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import SequelizeStore from 'connect-session-sequelize';
import session from 'express-session';
import passport from 'passport';
import cookieParser from 'cookie-parser';

import sequelize from './config/database';
import { UserModel } from './models/user';
import { RoleModel } from './models/role';
import { LessonModel } from './models/lesson';
import { CourseModel } from './models/course';
import { CourseInstructorModel } from './models/courseInstructor';
import { GradeModel } from './models/grade';
import { CourseStudentModel } from './models/courseStudent';
import { CourseFeedbackModel } from './models/courseFeedback';

const app: Express = express();
const port = 3000; 
const SequelizeStoreInstance = SequelizeStore(session.Store);

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: 'your-secret-key', 
    resave: false,
    saveUninitialized: false,
    store: new SequelizeStoreInstance({ db: sequelize }), 
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express server!');
});

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Connection to PostgreSQL has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}

async function init(): Promise<void> {
  try {
    UserModel.initialize(sequelize);
    RoleModel.initialize(sequelize);
    LessonModel.initialize(sequelize);
    CourseModel.initialize(sequelize);
    GradeModel.initialize(sequelize);
    CourseInstructorModel.initialize(sequelize);
    CourseStudentModel.initialize(sequelize);
    CourseFeedbackModel.initialize(sequelize);

    CourseInstructorModel.associate({ CourseModel, UserModel });
    CourseStudentModel.associate({ CourseModel, UserModel });
    CourseFeedbackModel.associate({ CourseModel, UserModel });
    CourseModel.associate({ LessonModel, UserModel });

    await sequelize.sync({ alter: true }); 

    const tableNames = Object.values(sequelize.models).map((model) => model.tableName);
    console.log('Tables created:', tableNames.join(', '));
    
  } catch (error) {
    console.error('Error starting the application:', error);
  }
}

async function serverListen() {
  try {
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    })
  } catch(error){
    console.error(`Error: Cannot start the server ${error}`)
  }
}

async function startServer() {
  await connectToDatabase();
  await init();
  await serverListen();
}

startServer();

export default app;
