const Chalk = require('chalk');
const { StatusCodeConstants } = require('../../../constants');
const { UserService, TeamsService } = require('../services');
const { Response } = require('../../../utils');

module.exports = {
  getDashboard: async (req, res) => {
    try {
      const totalSupervisor = await UserService.countUsers();
      const totalTeams = await TeamsService.countTeams();
      // const upcomingHoliday = await 
      return res.status(StatusCodeConstants.SUCCESS).send(Response.sendSuccess(
        '',
        {
          totalSupervisor,
          totalTeams
        },
        StatusCodeConstants.SUCCESS
      ));
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      Chalk.red(error);
      return res.status(code).send(Response.sendError(
        message,
        error,
        code
      ));
    }
  }
};
