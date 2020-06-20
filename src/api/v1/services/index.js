const UserService = require('./user.service');
const JwtService = require('./jwt.service');
const OtpService = require('./otp.service');
const TeamsService = require('./team.service');
const TeamAssociationService = require('./teamAssociations');
const EmployeeService = require('./employer.service');
const LeaveService = require('./leaves.service');
const DesignationService = require('./designation.service');

module.exports = {
  UserService,
  JwtService,
  OtpService,
  TeamsService,
  TeamAssociationService,
  EmployeeService,
  LeaveService,
  DesignationService
};
