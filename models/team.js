const { StatusConstants } = require('../src/constants');

module.exports = (sequelize, DataTypes) => sequelize.define('Team', {
  teamName: {
    allowNull: false,
    type: DataTypes.STRING(100)
  },
  status: {
    allowNull: false,
    type: DataTypes.ENUM(
      StatusConstants.ACTIVE,
      StatusConstants.INACTIVE
    )
  }
}, { paranoid: true });
