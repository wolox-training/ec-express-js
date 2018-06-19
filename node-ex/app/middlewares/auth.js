const sessionManager = require('./../services/sessionManager'),
  User = require('../models').User;

exports.secure = (req, res, next) => {
  const auth = req.headers[sessionManager.HEADER_NAME];

  if (auth) {
    const bearer = auth.split(' ');
    const bearerToken = bearer[1];
    const decoded = sessionManager.decode(bearerToken);

    return User.findOne({ where: decoded.user.id }).then(u => {
      if (u) {
        req.user = u;
        next();
      } else {
        res.status(401);
        res.end();
      }
    });
  } else {
    res.status(403);
    res.end();
  }
};
