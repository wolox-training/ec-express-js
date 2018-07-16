const crypto = require('crypto');

exports.createHash = () => {
  return crypto.randomBytes(20).toString('hex');
};
