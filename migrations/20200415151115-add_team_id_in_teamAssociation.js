
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('TeamAssociations', 'teamId', {
    type: Sequelize.INTEGER,
    references: {
      model: 'Teams',
      key: 'id'
    },
    after: 'userId'
  }), /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */


  down: (queryInterface) => queryInterface.removeColumn('TeamAssociations', 'teamId')
  /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

};
