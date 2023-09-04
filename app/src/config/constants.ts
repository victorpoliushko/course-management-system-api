require('dotenv').config();
import path from 'path';
import fs from 'fs';
import { Dialect } from 'sequelize';

const port: number = parseInt(process.env.DB_PORT || '5432', 10);

const constants = {
  adminId: '7823ff39-4e96-4d23-a59c-e79c63dd48cf',
  studentId: 'e79c312b-39c2-44dc-bd43-be5c4584d700',
  courseLimit: 5,
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
