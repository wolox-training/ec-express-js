const bcrypt = require('bcryptjs'),
  errors = require('../errors');

exports.encrypt = password => {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds).catch(err => {
    throw errors.defaultError();
  });
};
