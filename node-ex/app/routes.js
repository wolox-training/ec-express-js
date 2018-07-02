const user = require('./controllers/users'),
  validation = require('./validations/validations'),
  { check, validationResult } = require('express-validator/check');

exports.init = app => {
  app.post('/users', validation.userValidation, user.create);
  app.post('/users/sessions', [], user.login);
};
