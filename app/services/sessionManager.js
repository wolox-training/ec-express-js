const jwt = require('jsonwebtoken'),
  config = require('./../../config');

exports.HEADER_NAME = config.common.session.header_name;
exports.encode = user => {
  return jwt.sign({ user }, 'secretkey');
};
exports.decode = token => {
  return jwt.decode(token);
};
