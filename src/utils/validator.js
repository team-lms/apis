const validate = require('validate.js');

module.exports = {
  validate: (values, constraints) => validate(values, constraints),
};
