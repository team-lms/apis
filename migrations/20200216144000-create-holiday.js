const { LeaveTypeConstants, StatusConstants } = require('../src/constants');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Holidays', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    title: {
      allowNull: false,
      type: Sequelize.STRING(1000)
    },
    leaveType: {
      type: Sequelize.ENUM(
        LeaveTypeConstants.FLOATING,
        LeaveTypeConstants.GENERAL
      )
    },
    status: {
      type: Sequelize.ENUM(
        StatusConstants.ACTIVE,
        StatusConstants.INACTIVE
      )
    },
    date: {
      allowNull: false,
      type: Sequelize.DATE
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
  down: (queryInterface) => queryInterface.dropTable('Holidays')
};
