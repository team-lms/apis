'use strict';
const { RolesConstants, StatusConstants } = require("../src/constants")
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true
    },
    firstName: {
      allowNull: false,
      type: DataTypes.STRING(50),
    },
    lastName: {
      type: DataTypes.STRING(50),
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING(100),
      unique: true
    },
    phoneNumber: {
      allowNull: false,
      type: DataTypes.STRING(10),
      unique: true
    },
    whatsappNumber: {
      unique: true,
      type: DataTypes.STRING(10),
    },
    deviceToken: {
      type: DataTypes.STRING(50),
    },
    appVersion: {
      type: DataTypes.STRING(50),
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING(100),
    },
    designation: {
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    role: {
      allowNull: false,
      type: DataTypes.ENUM(
        RolesConstants.ADMIN,
        RolesConstants.SUPERVISOR,
        RolesConstants.HR,
        RolesConstants.EMPLOYEE
      ),
      defaultValue: RolesConstants.EMPLOYEE
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM(
        StatusConstants.ACTIVE,
        StatusConstants.INACTIVE
      ),
      defaultValue: StatusConstants.INACTIVE
    },
    casualLeaves: {
      type: DataTypes.INTEGER(3),
    },
    bufferLeaves: {
      type: DataTypes.INTEGER(3)
    },
    unAuthorizedLeaves: {
      type: DataTypes.INTEGER(3)
    },


  }, {});
  User.associate = function (models) {
    // associations can be defined here
  };
  return User;
};