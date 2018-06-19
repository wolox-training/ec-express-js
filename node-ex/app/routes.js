const user = require('./controllers/users');
const validation = require('./validations/validations');
const { check, validationResult } = require('express-validator/check');

exports.init = app => {
  // app.get('/endpoint/get/path', [], controller.methodGET);
  // app.put('/endpoint/put/path', [], controller.methodPUT);
  // app.post('/endpoint/post/path', [], controller.methodPOST);

  app.post('/users', validation.userValidation, user.create);
  app.post('/users/sessions', [], user.login);
};
