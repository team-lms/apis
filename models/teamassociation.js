const { StatusConstants } = require('../src/constants');

module.exports = (sequelize, DataTypes) => {
  const TeamAssociation = sequelize.define('TeamAssociation', {
    userId: {
      type: DataTypes.INTEGER,
    },
    isSupervisor: {
      type: DataTypes.BOOLEAN,
    },
    status: {
      type: DataTypes.ENUM(
        StatusConstants.ACTIVE,
        StatusConstants.INACTIVE,
      ),
    },
  }, { paranoid: true });
  TeamAssociation.associate = (models) => {
    TeamAssociation.belongsTo(models.User, { as: 'user', foreignKey: 'userId', foreignKeyConstraint: true });
  };
  return TeamAssociation;
};
