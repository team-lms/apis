const { LeaveTypeConstants, StatusConstants } = require('../src/constants');

module.exports = (sequelize, DataTypes) => {
  const Leave = sequelize.define('Leave', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    leaveType: {
      allowNull: false,
      type: DataTypes.ENUM(
        LeaveTypeConstants.FLOATING,
        LeaveTypeConstants.GENERAL,
      ),
    },
    durationInDays: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    description: {
      type: DataTypes.STRING(1000),
      allowNull: false,
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM(
        StatusConstants.PENDING,
        StatusConstants.AGREED,
        StatusConstants.APPROVED,
        StatusConstants.REJECTED,
        StatusConstants.CREDITED,
        StatusConstants.DEDUCTED,
      ),
    },
    fromDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    toDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    deletedAt: {
      type: DataTypes.DATE,
    },
  }, { paranoid: true });
  Leave.associate = (models) => {
    Leave.belongsTo(models.User, { as: 'user', foreignKey: 'userId', foreignKeyConstraint: true });
  };
  return Leave;
};
