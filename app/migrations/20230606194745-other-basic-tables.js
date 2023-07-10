'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();

    try{
      await queryInterface.createTable('course', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          allowNull: false,
          primaryKey: true
        },
        name: {
          allowNull: false,
          type: Sequelize.STRING
        },
        instructorId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'user',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }, { transaction }),
      await queryInterface.createTable('lesson', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          allowNull: false,
        },
        courseId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'course',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        title: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      }, { transaction }),
      await queryInterface.createTable('course_instructor', {
        courseId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'course',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        userId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'user',
            key: 'id'
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE'
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      }, { transaction }),
      await queryInterface.createTable('grade', {
        id: {
          allowNull: false,
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
        },
        lessonId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'lesson',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        studentId: {
          allowNull: false,
          type: Sequelize.UUID,
          references: {
            model: 'user',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        mark: {
          allowNull: false,
          type: Sequelize.INTEGER,
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
        },
      }, { transaction });

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction();

    try {

      await queryInterface.removeConstraint('course_instructor', 'course_instructor_courseId_fkey', {
        transaction,
      });
      
      await queryInterface.dropTable('grade', { transaction });
      await queryInterface.dropTable('course_instructor', { transaction });
      await queryInterface.dropTable('lesson', { transaction });
      await queryInterface.dropTable('course', { transaction });

      await transaction.commit();
    } catch(error) {
      await transaction.rollback();
      throw error;
    }
  }
};
