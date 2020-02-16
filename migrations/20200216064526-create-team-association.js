const { StatusConstants } = require("../src/constants")
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('teamAssociations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      isSupervisor: {
        type: Sequelize.BOOLEAN
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
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('teamAssociations');
  }
};