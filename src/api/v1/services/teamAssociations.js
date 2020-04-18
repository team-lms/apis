const { TeamAssociation } = require('../../../../models');

const TeamAssociationsService = {
  /**
   * Associate A Team
   */
  associateATeam: async (teamToBeAssociated, transaction = null) => TeamAssociation.create(
    teamToBeAssociated,
    { ...(transaction && { transaction }) }
  ),

  updateAssociatingATeam: async (teamToBeAssociated, id,
    transaction = null) => TeamAssociation.update(
    teamToBeAssociated, {
      where: {
        id,
        ...(transaction && { transaction })
      }
    }
  )


};
module.exports = TeamAssociationsService;
