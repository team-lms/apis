const { StatusConstants } = require("../src/constants")
module.exports = (sequelize, DataTypes) => {
  const Teams = sequelize.define('Teams', {
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
  }, {});
  return Teams;
};