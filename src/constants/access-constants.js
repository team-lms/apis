const RolesConstants = require('./roles.constants');

module.exports = Object.freeze({
  TEAM: Object.freeze({
    CREATE: [RolesConstants.ADMIN, RolesConstants.HR],
    GET_ALL: [RolesConstants.ADMIN, RolesConstants.HR],
    UPDATE: [RolesConstants.ADMIN, RolesConstants.HR],
    DELETE: [RolesConstants.ADMIN, RolesConstants.HR]
  }),

  HUMAN_RESOURCE: Object.freeze({
    CREATE: [RolesConstants.ADMIN],
    GET_ALL: [RolesConstants.ADMIN],
    UPDATE: [RolesConstants.ADMIN],
    DELETE: [RolesConstants.ADMIN]
  }),

  SUPERVISOR: Object.freeze({
    CREATE: [RolesConstants.ADMIN, RolesConstants.HR],
    GET_ALL: [RolesConstants.ADMIN, RolesConstants.HR],
    UPDATE: [RolesConstants.ADMIN, RolesConstants.HR],
    DELETE: [RolesConstants.ADMIN, RolesConstants.HR]
  }),

  EMPLOYEE: Object.freeze({
    CREATE: [RolesConstants.ADMIN, RolesConstants.HR],
    GET_ALL: [RolesConstants.ADMIN, RolesConstants.HR],
    UPDATE: [RolesConstants.ADMIN, RolesConstants.HR],
    DELETE: [RolesConstants.ADMIN, RolesConstants.HR]
  }),

  DESIGNATION: Object.freeze({
    CREATE: [RolesConstants.ADMIN],
    GET_ALL: [RolesConstants.ADMIN, RolesConstants.HR],
    UPDATE: [RolesConstants.ADMIN, RolesConstants.HR],
    DELETE: [RolesConstants.ADMIN]
  })

});
