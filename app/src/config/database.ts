import { Dialect, Sequelize } from "sequelize";
require('dotenv').config();

const port: number = parseInt(process.env.DB_PORT || '5432', 10);

const config = {
  database: process.env.DB_NAME || 'postgres',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port,
  dialect: process.env.DB_DIALECT as Dialect || 'postgres' as Dialect,
  dialectOptions: {
    ssl: false, 
  },
};

if (process.env.NODE_ENV === 'production') {
  console.log('Running from cloud. Connecting to DB through GCP socket.');
  config.host = `/cloudsql/${process.env.INSTANCE_CONNECTION_NAME}`;
}

else {
  console.log('Running from localhost. Connecting to DB directly.');
  config.host = 'localhost' ;
}

const sequelize = new Sequelize(config);

export default sequelize;
