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
import { CourseUserModel } from './models/courseUser';
import { GradeModel } from './models/grade';
import { CourseFeedbackModel } from './models/courseFeedback';
import courseRouter from './routes/courses';
import authRouter from './routes/auth';
import feedbackRouter from './routes/feedback';
import gradesRouter from './routes/grades';
import usersRouter from './routes/users';
import constants from './config/constants';
import lessonRouter from './routes/lesson';
import homeworkRouter from './routes/homework';

const app: Express = express();
const port = 8080; 
const SequelizeStoreInstance = SequelizeStore(session.Store);

app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());
app.use(
  session({
    secret: constants.sessionSecret, 
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

app.use('/auth', authRouter);
app.use('/courses', courseRouter);
app.use('/feedbacks', feedbackRouter);
app.use('/grades', gradesRouter);
app.use('/users', usersRouter);
app.use('/lessons', lessonRouter);
app.use('/homework', homeworkRouter);

async function connectToDatabase() {
  try {
    console.log('Trying to connect to PostgreSQL.');

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
    CourseUserModel.initialize(sequelize);
    CourseFeedbackModel.initialize(sequelize);

    RoleModel.associate({ UserModel });
    CourseUserModel.associate({ CourseModel, UserModel, RoleModel });
    CourseFeedbackModel.associate({ CourseModel, UserModel });
    CourseModel.associate({ LessonModel, UserModel });
    GradeModel.associate({ LessonModel, UserModel });

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
