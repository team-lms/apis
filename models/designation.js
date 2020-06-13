
const { StatusConstants } = require('../src/constants');

module.exports = (sequelize, DataTypes) => {
  const designation = sequelize.define('designation', {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(50)
    },
    status: {
      type: DataTypes.ENUM(
        StatusConstants.ACTIVE,
        StatusConstants.INACTIVE
      )
    }
  }, { paranoid: true });

  return designation;
};
