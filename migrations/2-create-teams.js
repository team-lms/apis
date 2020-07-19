const { StatusConstants } = require('../src/constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Teams', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      teamName: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING(100)
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(
          StatusConstants.ACTIVE,
          StatusConstants.INACTIVE
        )
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface) => queryInterface.dropTable('Teams')
};
