module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert('Designations', [{
    name: 'Administrator',
    status: 'Active',
    createdAt: new Date(),
    updatedAt: new Date()
  }]),

  down: (queryInterface) => queryInterface.bulkUpdate('Designations', null, {})

};
