const uuid = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('role', [
      {
        id: uuid.v4(),
        name: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'student',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid.v4(),
        name: 'instructor',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('role', null, {});
  },
};
