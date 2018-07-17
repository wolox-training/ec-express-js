const User = require('../models').User,
  { validationResult } = require('express-validator/check'),
  errors = require('../errors'),
  helperPassword = require('../helpers/password');

const createUser = user => {
  const saltRounds = 10;
  return User.getOne(user.email).then(u => {
    if (!u) {
      return helperPassword.encrypt(user.password).then(hash => {
        user.password = hash;

        return User.createModel(user)
          .then(s => {
            return s;
          })
          .catch(err => {
            throw err;
          });
      });
    } else {
      throw errors.savingError('email_already_exists');
    }
  });
};

exports.create = (req, res, next) => {
  const saltRounds = 10;
  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
        administrator: req.body.administrator
      }
    : {};

  const error = validationResult(req);
  if (!error.isEmpty()) {
    res.status(400);
    return next(errors.savingError(error.array()));
  }

  createUser(user)
    .then(s => {
      res.send({ user_created: `${user.email}` });
      res.status(200);
      res.end();
    })
    .catch(next);
};
