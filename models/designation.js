
const { StatusConstants } = require('../src/constants');

module.exports = (sequelize, DataTypes) => {
  const Designation = sequelize.define('Designation', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    name: {
      allowNull: false,
      unique: true,
      type: DataTypes.STRING(50)
    },
    status: {
      type: DataTypes.ENUM(
        StatusConstants.ACTIVE,
        StatusConstants.INACTIVE
      )
    }
  }, { paranoid: true });

  return Designation;
};
