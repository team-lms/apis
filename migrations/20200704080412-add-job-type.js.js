const { JobTypeConstants } = require('../src/constants');

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'jobType', {
    after: 'hiredOn',
    type: Sequelize.ENUM(
      JobTypeConstants.FULL_TIME,
      JobTypeConstants.PART_TIME
    ),
    defaultValue: JobTypeConstants.FULL_TIME
  }),

  down: (queryInterface) => queryInterface.removeColumn('Users', 'jobType')
};
