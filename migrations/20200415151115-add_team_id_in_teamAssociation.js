module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('TeamAssociations', 'teamId', {
    type: Sequelize.INTEGER,
    references: {
      model: 'Teams',
      key: 'id'
    },
    after: 'userId'
  }),
  down: (queryInterface) => queryInterface.removeColumn('TeamAssociations', 'teamId')
};
