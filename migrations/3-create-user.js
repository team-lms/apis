const {
  DefaultValuesConstants,
  JobTypeConstants,
  MaritalStatusConstants,
  RolesConstants,
  SexConstants,
  StatusConstants
} = require('../src/constants');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Users', {
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
      middleName: {
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
      dateOfBirth: {
        type: Sequelize.DATE,
        allowNull: false
      },
      address: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      pinCode: {
        type: Sequelize.STRING(50),
        allowNull: false
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
        type: Sequelize.STRING(50),
        allowNull: false,
        references: {
          model: 'Designations',
          key: 'name'
        },
        onUpdate: 'CASCADE'
      },
      role: {
        allowNull: false,
        type: Sequelize.ENUM(
          RolesConstants.ADMIN,
          RolesConstants.SUPERVISOR,
          RolesConstants.HR,
          RolesConstants.EMPLOYEE
        )
      },
      status: {
        allowNull: false,
        type: Sequelize.ENUM(
          StatusConstants.ACTIVE,
          StatusConstants.INACTIVE
        )
      },
      employeeId: {
        unique: true,
        allowNull: false,
        type: Sequelize.STRING
      },
      sex: {
        type: Sequelize.ENUM(
          SexConstants.MALE,
          SexConstants.FEMALE,
          SexConstants.OTHER
        ),
        allowNull: false
      },
      maritalStatus: {
        type: Sequelize.ENUM(
          MaritalStatusConstants.SINGLE,
          MaritalStatusConstants.MARRIED,
          MaritalStatusConstants.WIDOWED,
          MaritalStatusConstants.SEPARATED,
          MaritalStatusConstants.DIVORCED
        ),
        allowNull: false
      },
      nationality: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      hiredOn: {
        type: Sequelize.DATE,
        allowNull: false
      },
      jobType: {
        allowNull: false,
        type: Sequelize.ENUM(
          JobTypeConstants.FULL_TIME,
          JobTypeConstants.PART_TIME
        ),
        defaultValue: JobTypeConstants.FULL_TIME
      },
      profilePicture: {
        type: Sequelize.STRING(100)
      },
      casualLeaves: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: DefaultValuesConstants.USER_CASUAL_LEAVES
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
      teamId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Teams',
          key: 'id'
        }
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
  down: (queryInterface) => queryInterface.dropTable('Users')
};
