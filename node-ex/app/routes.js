const user = require('./controllers/users'),
  validation = require('./validations/validations'),
  { check, validationResult } = require('express-validator/check'),
  auth = require('./middlewares/auth');

exports.init = app => {
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);

  app.post('/users', validation.userValidation, user.create);
  app.post('/users/sessions', [], user.login);
  app.get('/users/me', [auth.secure], user.loggedUser);
};
