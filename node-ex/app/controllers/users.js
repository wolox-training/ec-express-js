'use strict';

const User = require('../models').User,
  bcrypt = require('bcryptjs'),
  { validationResult } = require('express-validator/check'),
  errors = require('../errors'),
  sessionManager = require('./../services/sessionManager');

exports.create = (req, res, next) => {
  const saltRounds = 10;

  const user = req.body
    ? {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: req.body.password,
        email: req.body.email
      }
    : {};

  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(422).json({ error: error.array() });
  }

  User.findOneModel(user.email)
    .then(u => {
      bcrypt
        .hash(user.password, saltRounds)
        .then(hash => {
          user.password = hash;

          User.createModel(user)
            .then(s => {
              res.status(200);
              res.end();
            })
            .catch(err => {
              next(err);
            });
        })
        .catch(err => {
          next(errors.defaultError(err));
        });
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
      bcrypt.compare(user.password, u.password).then(isValid => {
        if (isValid) {
          const auth = sessionManager.encode({ u });
          
          res.status(200);
          // res.set(sessionManager.HEADER_NAME, auth);
          res.send(u);
        } else {
          next(errors.invalidUser);
        }
      });
    } else {
      next(errors.invalidUser);
    }
  });
};
