const jwt = require('jsonwebtoken');

exports.encode = user => {
  return jwt.sign({ user }, 'my_secret_key');
};
