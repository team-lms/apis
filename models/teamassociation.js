const { StatusConstants } = require("../src/constants")
module.exports = (sequelize, DataTypes) => {
  const teamAssociation = sequelize.define('teamAssociation', {
    userId: {
      type: DataTypes.INTEGER,
    },
    isSupervisor: {
      type: DataTypes.BOOLEAN,
    },
    status: {
      type: DataTypes.ENUM(
        StatusConstants.ACTIVE,
        StatusConstants.INACTIVE
      ),
    }
  }, {});
  teamAssociation.associate = (models) => {
    teamAssociation.belongsTo('models.user', {
      as: 'user',
      foreignKey: 'userId',
      foreignKeyConstraint: true
    })

    // associations can be defined here
  };
  return teamAssociation;
};