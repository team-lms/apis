const { StatusConstants } = require('../src/constants');

module.exports = (sequelize, DataTypes) => {
  const Team = sequelize.define('Team', {
    teamName: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING(100)
    },
    status: {
      allowNull: false,
      type: DataTypes.ENUM(
        StatusConstants.ACTIVE,
        StatusConstants.INACTIVE
      )
    }
  }, { paranoid: true });
  Team.associate = (models) => {
    Team.belongsToMany(models.User, { as: 'users', through: 'TeamAssociation', foreignKey: 'teamId' });
  };

  return Team;
};
