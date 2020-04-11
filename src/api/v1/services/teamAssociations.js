const { TeamAssociation } = require('../../../../models');

const TeamAssociationsService = {
  associateATeam: async (teamToBeAssociated, transaction = null) => TeamAssociation.create(
    teamToBeAssociated,
    { ...(transaction && { transaction }) }
  )
};
module.exports = TeamAssociationsService;
