const { RolesConstants, StatusConstants } = require("../src/constants")
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
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
        type: Sequelize.INTEGER(3),
      },
      bufferLeaves: {
        type: Sequelize.INTEGER(3)
      },
      unAuthorizedLeaves: {
        type: Sequelize.INTEGER(3)
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
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};