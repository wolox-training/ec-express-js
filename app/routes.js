const user = require('./controllers/users'),
  validation = require('./validations/validations'),
  { check, validationResult } = require('express-validator/check'),
  auth = require('./middlewares/auth');

exports.init = app => {
  app.post('/users', validation.userValidation, user.create);
  app.post('/users/sessions', [], user.login);
  app.get('/users', [auth.secure], user.listAll);
  app.post('/admin/users', [auth.secure, auth.secureAdmin], user.updateOrCreate);
};
