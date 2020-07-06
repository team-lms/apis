module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'designation', {
      type: Sequelize.STRING(50),
      allowNull: false,
      references: {
        model: 'Designations',
        key: 'name'
      },
      onUpdate: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Users', 'designation', {
      allowNull: false,
      type: Sequelize.STRING(50)
    });
  }
};
