const { StatusConstants } = require('../src/constants');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Teams', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    teamName: {
      allowNull: false,
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
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('Teams')
};
