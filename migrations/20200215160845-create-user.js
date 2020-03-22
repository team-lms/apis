const {
  DefaultValuesConstants,
  RolesConstants,
  StatusConstants
} = require('../src/constants');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING(50)
    },
    lastName: {
      type: Sequelize.STRING(50)
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING(100),
      unique: true
    },
    phoneNumber: {
      allowNull: false,
      type: Sequelize.STRING(10),
      unique: true
    },
    whatsappNumber: {
      unique: true,
      type: Sequelize.STRING(10)
    },
    deviceToken: {
      type: Sequelize.STRING(50)
    },
    appVersion: {
      type: Sequelize.STRING(50)
    },
    password: {
      allowNull: false,
      type: Sequelize.STRING(100)
    },
    designation: {
      allowNull: false,
      type: Sequelize.STRING(100)
    },
    role: {
      allowNull: false,
      type: Sequelize.ENUM(
        RolesConstants.ADMIN,
        RolesConstants.SUPERVISOR,
        RolesConstants.HR,
        RolesConstants.EMPLOYEE
      ),
    },
    status: {
      allowNull: false,
      type: Sequelize.ENUM(
        StatusConstants.ACTIVE,
        StatusConstants.INACTIVE
      )
    },
    casualLeaves: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: DefaultValuesConstants.USER_CASUAL_LEAVES,
    },
    bufferLeaves: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: DefaultValuesConstants.USER_BUFFER_LEAVES
    },
    unAuthorizedLeaves: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: DefaultValuesConstants.USER_UNAUTHORIZED_LEAVES
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    deletedAt: {
      type: Sequelize.DATE
    }
  }),
  down: (queryInterface) => queryInterface.dropTable('Users')
};
