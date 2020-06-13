
const { Op } = require('sequelize');
const { Designation } = require('../../../../models');
const { StatusConstants } = require('../../../constants');

const DesignationService = {
  /**
   * Find Designation on the basis of name
   */
  findDesignationByName: async ({ name, status = StatusConstants.ACTIVE }) => Designation.findOne({
    where: {
      [Op.and]: [
        { ...(name && { name }) },
        { ...(status && { status }) }
      ]
    }
  }),

  /**
   * Create a Designation
   */
  createADesignation: async (designationToBeCreated, transaction = null) => Designation.create(
    designationToBeCreated, {
      ...(transaction && { transaction })
    }
  )
};
module.exports = DesignationService;
