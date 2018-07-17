const User = require('../models').User,
  { validationResult } = require('express-validator/check'),
  errors = require('../errors'),
  sessionManager = require('./../services/sessionManager'),
  helperPassword = require('../helpers/password'),
  hashToken = require('../helpers/hashToken');

const createUser = user => {
  const saltRounds = 10;
  return User.getOne(user.email)
    .then(u => {
      return helperPassword.encrypt(user.password).then(hash => {
        user.password = hash;
        user.hash = hashToken.createHash();

        return User.createModel(user)
          .then(s => {
            return s;
          })
          .catch(err => {
            throw err;
          });
      });
    })
    .catch(err => {
      throw errors.savingError('email_already_exists');
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

exports.login = (req, res, next) => {
  const user = req.body
    ? {
        email: req.body.email,
        password: req.body.password
      }
    : {};

  return User.findByEmail(user.email).then(u => {
    if (u) {
      return helperPassword.compare(user.password, u.password).then(isValid => {
        if (isValid) {
          const auth = sessionManager.encode(u);

          res.status(200);
          res.set(sessionManager.HEADER_NAME, auth);
          res.send({ user: u, token: `Your token is valid for ${process.env.TOKEN_EXPIRE_TIME}` });
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
  return User.findAllUsers(req.query.limit, req.query.offset).then(users => {
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
  return User.findByEmail(user.email)
    .then(u => {
      if (u) {
        return User.updateModel(user)
          .then(response => {
            res.send(200);
            res.end();
          })
          .catch(next);
      } else {
        createUser(user)
          .then(s => {
            res.send({ user_created_as_admin: `${user.email}` });
            res.status(200);
            res.end();
          })
          .catch(next);
      }
    })
    .catch(next);
};

exports.loggedUser = (req, res, next) => {
  res.status(200);
  res.send(req.user);
};

exports.invalidateAll = (req, res, next) => {
  const hash = hashToken.createHash();
  const user = req.user.email;
  return User.updateHash(user, hash)
    .then(response => {
      res.status(200);
      res.send({ hash: 'changed', sessions: 'All sessions was invalidated' });
      res.end();
    })
    .catch(next);
};
