const RolesConstants = require('./roles.constants');

module.exports = Object.freeze({
  TEAM: Object.freeze({
    CREATE: [RolesConstants.ADMIN, RolesConstants.HR],
    GET_ALL: [RolesConstants.ADMIN, RolesConstants.HR],
    UPDATE: [RolesConstants.ADMIN, RolesConstants.HR],
    DELETE: [RolesConstants.ADMIN, RolesConstants]
  })

});
