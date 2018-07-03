const User = require('../models').User,
  { validationResult } = require('express-validator/check'),
  errors = require('../errors'),
  helperPassword = require('../helpers/password');

const createUser = function(user) {
  return new Promise(function(resolve, reject) {
    const saltRounds = 10;
    User.findOneModel(user.email)
      .then(u => {
        helperPassword.encrypt(user.password).then(hash => {
          user.password = hash;

          User.createModel(user)
            .then(s => {
              resolve(s);
            })
            .catch(err => {
              reject(err);
            });
        });
      })
      .catch(err => {
        reject(errors.savingError('email_already_exists'));
      });
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
    .catch(err => {
      next(err);
    });
};