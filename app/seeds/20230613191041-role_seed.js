'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('role', [{
      id: uuidv4(),
      name: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      name: 'student',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4(),
      name: 'instructor',
      createdAt: new Date(),
      updatedAt: new Date()
    }
    ], {});
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role', null, {});
  }
}
