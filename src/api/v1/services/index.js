const DesignationService = require('./designation.service');
const JwtService = require('./jwt.service');
const LeaveService = require('./leaves.service');
const OtpService = require('./otp.service');
const TeamAssociationService = require('./teamAssociations');
const TeamsService = require('./team.service');
const UserService = require('./user.service');

module.exports = {
  DesignationService,
  JwtService,
  LeaveService,
  OtpService,
  TeamAssociationService,
  TeamsService,
  UserService
};
