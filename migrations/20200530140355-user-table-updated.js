const { SexConstants, MaritalStatusConstants } = require('../src/constants');

module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Users', 'middleName', {
      type: Sequelize.STRING(50),
      after: 'firstName'
    }),
    queryInterface.addColumn('Users', 'dateOfBirth', {
      type: Sequelize.DATE,
      after: 'whatsappNumber',
      allowNull: false
    }),
    queryInterface.addColumn('Users', 'address', {
      type: Sequelize.STRING(100),
      after: 'whatsappNumber',
      allowNull: false
    }),
    queryInterface.addColumn('Users', 'pinCode', {
      type: Sequelize.STRING(50),
      after: 'whatsappNumber',
      allowNull: false
    }),
    queryInterface.addColumn('Users', 'sex', {
      type: Sequelize.ENUM(
        SexConstants.MALE,
        SexConstants.FEMALE,
        SexConstants.OTHER
      ),
      after: 'employeeId',
      allowNull: false
    }),
    queryInterface.addColumn('Users', 'maritalStatus', {
      type: Sequelize.ENUM(
        MaritalStatusConstants.SINGLE,
        MaritalStatusConstants.MARRIED,
        MaritalStatusConstants.WIDOWED,
        MaritalStatusConstants.SEPARATED,
        MaritalStatusConstants.DIVORCED
      ),
      after: 'sex',
      allowNull: false
    }),
    queryInterface.addColumn('Users', 'nationality', {
      type: Sequelize.STRING(50),
      after: 'maritalStatus',
      allowNull: false
    }),
    queryInterface.addColumn('Users', 'hiredOn', {
      type: Sequelize.DATE,
      after: 'nationality',
      allowNull: false
    })
  ]),
  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn('Users', 'middleName'),
    queryInterface.removeColumn('Users', 'dateOfBirth'),
    queryInterface.removeColumn('Users', 'address'),
    queryInterface.removeColumn('Users', 'pinCode'),
    queryInterface.removeColumn('Users', 'sex'),
    queryInterface.removeColumn('Users', 'maritalStatus'),
    queryInterface.removeColumn('Users', 'nationality'),
    queryInterface.removeColumn('Users', 'hiredOn')
  ])
};
