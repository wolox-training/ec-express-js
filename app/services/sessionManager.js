const jwt = require('jsonwebtoken'),
  config = require('./../../config'),
  errors = require('../errors'),
  User = require('../models').User;

const verifyHash = token => {
  return User.findOne({ where: { hash: token.user.hash, email: token.user.email } }).then(result => {
    if (result !== null) {
      return result;
    } else {
      throw errors;
    }
  });
};
exports.HEADER_NAME = config.common.session.header_name;
exports.encode = user => {
  return jwt.sign({ user }, 'secretkey', { expiresIn: process.env.TOKEN_EXPIRE_TIME });
};
exports.decode = token => {
  return jwt.decode(token);
};
exports.verify = token => {
  const tokenDecoded = exports.decode(token);
  return verifyHash(tokenDecoded)
    .then(result => {
      return jwt.verify(token, 'secretkey', err => {
        if (!err) {
          return true;
        }
      });
    })
    .catch(err => {
      return false;
    });
};
