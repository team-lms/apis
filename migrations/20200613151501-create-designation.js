const { StatusConstants } = require('../src/constants');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Designations', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING(50)
    },
    status: {
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
  }),
  down: (queryInterface) => queryInterface.dropTable('designations')
};
