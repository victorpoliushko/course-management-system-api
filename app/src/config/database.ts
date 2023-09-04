import { Sequelize } from "sequelize";
import constants from "./constants";
console.log(`\n\n AAA: ${constants.db.name} \n\n`);

const config = {
  database: constants.db.name,
  username: constants.db.user,
  password: constants.db.password,
  host: constants.db.host,
  port: constants.db.port,
  dialect: constants.db.dialect,
  dialectOptions: {
    ssl: false, 
  },
};

if(process.env.NODE_ENV === 'production') {
  console.log('Running from cloud. Connecting to DB through GCP socket.');
  config.host = `/cloudsql/${constants.db.instanceConnectionName}`;
}

// When running from localhost, get the config from .env
else {
  console.log('Running from localhost. Connecting to DB directly.');
  config.host = 'localhost' ;
}

const sequelize = new Sequelize(config);

// const sequelize = new Sequelize({
//   database: 'aa',
//   username: 'aa',
//   password: 'aa',
//   host: 'aa',
//   port: 2345,
//   dialect: 'postgres',
//   dialectOptions: {
//     ssl: false, 
//   },
// });

export default sequelize;
