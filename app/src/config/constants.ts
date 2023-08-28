require('dotenv').config();
import path from 'path';
import fs from 'fs';
import { Dialect } from 'sequelize';

const port: number = parseInt(process.env.DB_PORT || '5432', 10);

const constants = {
  adminId: '7823ff39-4e96-4d23-a59c-e79c63dd48cf',
  studentId: 'e79c312b-39c2-44dc-bd43-be5c4584d700',
  courseLimit: 5,
  // server: {
  //   env: process.env.NODE_ENV || 'development',
  //   port: process.env.PORT || 3000,
  //   prefix: process.env.PREFIX_PATH || 'courses',
  // },
  // mailerConfig: {
  //   email: process.env.PROJECT_SENDER_EMAIL,
  //   password: process.env.PROJECT_MAIL_PASSWORD,
  // },
  // hash: {
  //   passwordHashRounds: Number(process.env.PASSWORD_HASH_ROUNDS),
  // },
  // AWS_S3: {
  //   region: process.env.REGION,
  //   bucketName: process.env.BUCKET_NAME,
  //   endpoint: process.env.ENDPOINT,
  //   accessKeyId: process.env.ACCESS_KEY_ID,
  //   secretAccessKey: process.env.SECRET_ACCESS_KEY,
  // },
  // passwordGeneratorOptions: {
  //   length: 10,
  //   numbers: true,
  //   symbols: true,
  //   uppercase: true,
  //   lowercase: true,
  // },
  // tokenConfig: {
  //   secretKey: process.env.SECRET_KEY_TOKEN,
  //   expireAccessToken: Number(process.env.EXPIRE_ACCESS_TOKEN) * 60, // in seconds
  //   expireRefreshToken: process.env.EXPIRE_REFRESH_TOKEN, // string
  // },
  // requestLimitOptions: {
  //   time: Number(process.env.REQUEST_LIMIT_TIME) * 60 * 1000,
  //   maxRequests: Number(process.env.REQUEST_MAX_AMOUNT),
  //   ipWhiteList: process.env.IP_WHITE_LIST
  //     ? process.env.IP_WHITE_LIST.split(',')
  //     : null,
  // },
  // circuitBreakerOptions: { // https://www.npmjs.com/package/opossum
  //   // if a function takes longer than this time, trigger failure and open circuit breaker
  //   timeout: Number(process.env.HTTP_TIMEOUT) * 1000,
  //   // reject requests during this time
  //   resetTimeout: Number(process.env.RESET_TIMEOUT) * 1000,
  //   // when rich this percentage of failed requests than trigger failure and open circuit breaker
  //   errorThresholdPercentage: Number(process.env.ERROR_THRESHOLD_PERCENTAGE),
  // },
  db: {
    name: (process.env.NODE_ENV !== 'test' ? process.env.DB_NAME : process.env.TEST_DB_NAME) || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    port,
    dialect: process.env.DB_DIALECT as Dialect || 'postgres' as Dialect
  },
};

export default <Readonly<typeof constants>> constants;
