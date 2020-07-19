const { StatusConstants } = require('../src/constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Designations', {
      name: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING(50)
      },
      status: {
        type: Sequelize.ENUM(
          StatusConstants.ACTIVE,
          StatusConstants.INACTIVE
        ),
        allowNull: false,
        defaultValue: StatusConstants.ACTIVE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface) => queryInterface.dropTable('designations')
};
