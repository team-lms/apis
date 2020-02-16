const { LeaveTypeConstants, StatusConstants } = require("../src/constants")
module.exports = (sequelize, DataTypes) => {
  const leaves = sequelize.define('leaves', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    leaveType: {
      allowNull: false,
      type: DataTypes.ENUM(
        LeaveTypeConstants.FLOATING,
        LeaveTypeConstants.GENERAL
      )
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
        StatusConstants.DEDUCTED
      ),
    },
    fromDate: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    toDate: {
      allowNull: false,
      type: DataTypes.DATE
    },
    deletedAt: {
      type: DataTypes.DATE
    }

  }, {});
  leaves.associate = (models) => {
    leaves.belongsTo(models.user, {
      as: 'user',
      foreignKey: 'userId',
      foreignKeyConstraint: true
    })

    // associations can be defined here
  };
  return leaves;
};