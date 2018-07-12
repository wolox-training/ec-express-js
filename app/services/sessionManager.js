const jwt = require('jsonwebtoken'),
  config = require('./../../config');

exports.HEADER_NAME = config.common.session.header_name;
exports.encode = user => {
  return jwt.sign({ user }, 'secretkey', { expiresIn: process.env.TOKEN_EXPIRE_TIME });
};
exports.decode = token => {
  return jwt.decode(token);
};
exports.verify = token => {
  return jwt.verify(token, 'secretkey');
};
