const { StatusConstants } = require('../src/constants');

module.exports = (sequelize, DataTypes) => {
  const Designation = sequelize.define('Designation', {
    name: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING(50)
    },
    status: {
      type: DataTypes.ENUM(
        StatusConstants.ACTIVE,
        StatusConstants.INACTIVE
      ),
      allowNull: false,
      defaultValue: StatusConstants.ACTIVE
    }
  });

  return Designation;
};
