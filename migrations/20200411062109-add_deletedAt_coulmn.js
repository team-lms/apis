module.exports = {
  up: (queryInterface, Sequelize) => Promise.all([
    queryInterface.addColumn('Teams', 'deletedAt', {
      type: Sequelize.DATE,
      after: 'updatedAt'
    }),
    queryInterface.addColumn('TeamAssociations', 'deletedAt', {
      type: Sequelize.DATE,
      after: 'updatedAt'
    }),
    queryInterface.addConstraint('Teams', ['teamName'], {
      type: 'unique',
      name: 'teamName'
    })
  ]),
  down: (queryInterface) => Promise.all([
    queryInterface.removeColumn('Teams', 'deletedAt'),
    queryInterface.removeColumn('TeamAssociations', 'deletedAt'),
    queryInterface.removeConstraint('Teams', 'teamName')
  ])
};
