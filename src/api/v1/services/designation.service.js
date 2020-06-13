
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
  ),

  /**
   * Get Designation List
   */
  getAllDesignations: async ({
    offset, limit, sortBy, sortType, searchBy, searchTerm
  }) => {
    let searchCriteria = {};
    searchCriteria = {
      ...((searchBy && searchTerm) && {
        [searchBy]: {
          [Op.substring]: searchTerm
        }
      })
    };
    return Designation.findAndCountAll({
      where: {
        [Op.and]: [
          { status: StatusConstants.ACTIVE },
          searchCriteria
        ]
      },
      order: [[sortBy, sortType]],
      offset,
      limit
    });
  }
};
module.exports = DesignationService;
