import { Sequelize } from "sequelize";
import constants from "./constants";
console.log(`\n\n AAAAAAAAAA \n\n`);
const sequelize = new Sequelize({
  database: constants.db.name,
  username: constants.db.user,
  password: constants.db.password,
  host: constants.db.host,
  port: constants.db.port,
  dialect: constants.db.dialect,
  dialectOptions: {
    ssl: false, 
  },
});

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
