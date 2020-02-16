const { LeaveTypeConstants, StatusConstants } = require("../src/constants")
module.exports = (sequelize, DataTypes) => {
  const holiday = sequelize.define('holiday', {
    title: {
      allowNull: false,
      type: DataTypes.STRING(1000),
    },
    leaveType: {
      type: DataTypes.ENUM(
        LeaveTypeConstants.FLOATING,
        LeaveTypeConstants.GENERAL
      )
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
    },
    deletedAt: {
      type: DataTypes.Date
    }
  }, {});
  holiday.associate = function (models) {
    // associations can be defined here
  };
  return holiday;
};