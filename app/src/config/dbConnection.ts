import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  database: 'promotion',
  username: 'postgres',
  password: 'postgres',
  host: 'localhost',
  port: 5432,
  dialect: 'postgres',
  dialectOptions: {
    ssl: false, 
  },
});

export default sequelize;
