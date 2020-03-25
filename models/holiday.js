const { LeaveTypeConstants, StatusConstants } = require('../src/constants');

module.exports = (sequelize, DataTypes) => sequelize.define('Holiday', {
  title: {
    allowNull: false,
    type: DataTypes.STRING(1000)
  },
  leaveType: {
    type: DataTypes.ENUM(
      LeaveTypeConstants.FLOATING,
      LeaveTypeConstants.GENERAL
    ),
    defaultValue: LeaveTypeConstants.GENERAL
  },
  status: {
    type: DataTypes.ENUM(
      StatusConstants.ACTIVE,
      StatusConstants.INACTIVE
    )
  },
  date: {
    allowNull: false,
    type: DataTypes.DATE
  }
}, { paranoid: true });
