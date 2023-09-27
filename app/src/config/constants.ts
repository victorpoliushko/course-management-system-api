require('dotenv').config();
import path from 'path';
import fs from 'fs';
import { Dialect } from 'sequelize';

const port: number = parseInt(process.env.DB_PORT || '5432', 10);

const constants = {
  courseLimit: 5,
  minRequiredGrade: 80,
  sessionSecret: process.env.SESSION_SECRET || '',
  adminName: process.env.ADMIN_NAME,
  adminPass: process.env.ADMIN_PASS,
  db: {
    name: (process.env.NODE_ENV !== 'test' ? process.env.DB_NAME : process.env.TEST_DB_NAME) || 'postgres',
    host: process.env.DB_HOST || '34.72.139.197',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    port,
    dialect: process.env.DB_DIALECT as Dialect || 'postgres' as Dialect,
    instanceConnectionName: process.env.INSTANCE_CONNECTION_NAME
  },
};

export default <Readonly<typeof constants>> constants;
