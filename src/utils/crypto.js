const crypto = require('crypto');

module.exports = {
  randomBytes: (size) => crypto.randomBytes(size).toString('hex'),
};
