const sessionManager = require('./../services/sessionManager'),
  User = require('../models').User,
  errors = require('../errors');

exports.secure = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];
  if (auth) {
    const bearer = auth.split(' ');
    const bearerToken = bearer[1];
    const decoded = sessionManager.decode(bearerToken);
    if (sessionManager.verify(bearerToken)) {
      return User.findOne({ where: decoded.user.id }).then(u => {
        if (u) {
          req.user = u;
          next();
        } else {
          next(errors.headerError());
        }
      });
    }
  } else {
    next(errors.headerError());
  }
};

exports.secureAdmin = (req, res, next) => {
  if (req.user.administrator) {
    next();
  } else {
    next(errors.permissonError());
  }
};

exports.verifyId = (req, res, next) => {
  if (req.user.administrator || req.user.id === parseInt(req.params.user_id)) {
    next();
  } else {
    next(errors.permissonError());
  }
};
