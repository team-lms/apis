const { StatusConstants } = require('../src/constants');

module.exports = (sequelize, DataTypes) => {
  const TeamAssociation = sequelize.define('TeamAssociation', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    teamId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isSupervisor: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM(
        StatusConstants.ACTIVE,
        StatusConstants.INACTIVE
      ),
      allowNull: false
    }
  }, { paranoid: true });
  TeamAssociation.associate = (models) => {
    TeamAssociation.belongsTo(models.User, { as: 'user', foreignKey: 'userId', foreignKeyConstraint: true });
    TeamAssociation.belongsTo(models.Team, { as: 'team', foreignKey: 'teamId', foreignKeyConstraint: true });
  };
  return TeamAssociation;
};
