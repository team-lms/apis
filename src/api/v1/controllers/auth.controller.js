const { UserHelper } = require('../helpers');

module.exports = {
  login: async (req, res) => {
    const requestBody = req.body;
    const result = await UserHelper.loginUser(requestBody);
  },
};
