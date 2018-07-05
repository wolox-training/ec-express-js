const User = require('../models').User,
  { validationResult } = require('express-validator/check'),
  errors = require('../errors'),
  sessionManager = require('./../services/sessionManager'),
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

exports.login = (req, res, next) => {
  const user = req.body
    ? {
        email: req.body.email,
        password: req.body.password
      }
    : {};

  User.findByEmail(user.email).then(u => {
    if (u) {
      helperPassword.compare(user.password, u.password).then(isValid => {
        if (isValid) {
          const auth = sessionManager.encode(u);

          res.status(200);
          res.set(sessionManager.HEADER_NAME, auth);
          res.send(u);
        } else {
          next(errors.invalidUser());
        }
      });
    } else {
      next(errors.invalidUser());
    }
  });
};

exports.listAll = (req, res, next) => {
  User.findAllUsers(req.query.limit, req.query.offset).then(users => {
    res.status(200);
    res.send({ users });
  });
};

exports.updateOrCreate = (req, res, next) => {
  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email,
        administrator: 't'
      }
    : {};
  const email = user.email;
  User.findByEmail(user.email)
    .then(u => {
      if (u) {
        User.updateModel(user)
          .then(response => {
            res.send(200);
            res.end();
          })
          .catch(err => {
            next(err);
          });
      } else {
        createUser(user)
          .then(s => {
            res.send({ user_created_as_admin: `${user.email}` });
            res.status(200);
            res.end();
          })
          .catch(err => {
            next(err);
          });
      }
    })
    .catch(next);
};
