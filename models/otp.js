const { StatusConstants } = require('../src/constants');

module.exports = (sequelize, DataTypes) => {
  const Otp = sequelize.define('Otp', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    otp: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM(
        StatusConstants.ACTIVE,
        StatusConstants.INACTIVE
      )
    }
  }, {});
  Otp.associate = (models) => {
    Otp.belongsTo(models.User, { as: 'user', foreignKey: 'userId', foreignKeyConstraint: true });
  };
  return Otp;
};
