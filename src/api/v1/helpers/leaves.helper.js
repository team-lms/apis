const pug = require('pug');
const path = require('path');
const moment = require('moment');
const {
  StatusCodeConstants,
  RolesConstants,
  MessageCodeConstants
} = require('../../../constants');
const {
  Response,
  Mailer,
  Validator,
  ApiError
} = require('../../../utils');
const { UserService } = require('../services');

module.exports = {
  leaveApply: async (req) => {
    try {
      const userWhoAppliedLeave = req.body;
      const validationResult = Validator.validate(userWhoAppliedLeave, {
        leaveType: { presence: { allowEmpty: false } },
        fromDate: { presence: { allowEmpty: false } },
        toDate: { presence: { allowEmpty: false } },
        comment: { presence: { allowEmpty: false } }
      });

      if (validationResult) {
        throw new ApiError.ValidationError(MessageCodeConstants.VALIDATION_ERROR, validationResult);
      }
      if (moment().isSameOrAfter(userWhoAppliedLeave.fromDate)
        || moment().isSameOrAfter(userWhoAppliedLeave.toDate)) {
        throw new ApiError.ValidationError(MessageCodeConstants.APPLIED_DATE);
      }
      let usersToBeMailed = [];

      usersToBeMailed.push(req.userInfo.email);
      /**
       * Get All the Hrs.
       */
      const hr = await UserService.getAllUsersOfARole(RolesConstants.HR);
      /**
       * Get The Admin
       */
      const admin = await UserService.getAllUsersOfARole(RolesConstants.ADMIN);

      /**
       * Store them in usersToBeMailed
       */
      usersToBeMailed.push(admin[0].email);

      hr.map((singleHr) => usersToBeMailed.push(singleHr.email));

      if (req.userInfo.role === RolesConstants.EMPLOYEE) {
        /**
         * Find the Team of the Employee
         */
        // const teamWithUser = await TeamAssociationService
        //   .findTeamOfAUser({ userId: req.userInfo.id });

        /**
         *Find the Supervisor of the Team
        //  */
        // const supervisor = await TeamAssociationService
        //   .findSupervisorOfATeam({ teamId: teamWithUser.teamId });
        // usersToBeMailed.push(supervisor.data.email);
      }

      /**
       * Send the Mail to all the respective persons
       */
      usersToBeMailed = usersToBeMailed.join();

      (async () => {
        const html = await pug.renderFile(
          path.join(__dirname, '../../../templates/leave-applied.pug'), {
            userName: req.userInfo.firstName + req.userInfo.lastName,
            leaveType: userWhoAppliedLeave.leaveType,
            comment: userWhoAppliedLeave.comment
          }
        );

        Mailer.sendMail({
          to: usersToBeMailed,
          subject: 'Leave Applied',
          html
        });
      })();
      return {
        success: true,
        data: Response.sendSuccess(
          MessageCodeConstants.LEAVE_APPLIED,
          {},
          StatusCodeConstants.SUCCESS
        )
      };
    } catch ({ message, code = StatusCodeConstants.INTERNAL_SERVER_ERROR, error }) {
      return {
        success: false,
        error: Response.sendError(
          message,
          error,
          code
        )
      };
    }
  }

};
