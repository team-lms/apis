const {LeaveTypeConstants, StatusConstants} = require("../src/constants")
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('leaves', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        type: Sequelize.INTEGER,
        references: {
          model : 'Users',
          key: 'id'
        }
      },
      leaveType: {
        allowNull: false,
        type: Sequelize.ENUM(
          LeaveTypeConstants.FLOATING,
          LeaveTypeConstants.GENERAL
        )
      },
      durationInDays: {
        allowNull: false,
        type: Sequelize.STRING(50)
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING(1000)
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(
          StatusConstants.PENDING,
          StatusConstants.AGREED,
          StatusConstants.APPROVED,
          StatusConstants.REJECTED,
          StatusConstants.CREDITED,
          StatusConstants.DEDUCTED
        )
      },
      fromDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      toDate: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deletedAt: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('leaves');
  }
};