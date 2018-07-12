const user = require('./controllers/users'),
  albums = require('./controllers/albums'),
  validation = require('./validations/validations'),
  { check, validationResult } = require('express-validator/check'),
  auth = require('./middlewares/auth');

exports.init = app => {
  app.post('/users', validation.userValidation, user.create);
  app.post('/users/sessions', [], user.login);
  app.post('/users/me', [auth.secure], user.loggedUser);
  app.get('/users', [auth.secure], user.listAll);
  app.post('/admin/users', [auth.secure, auth.secureAdmin], user.updateOrCreate);
  app.get('/albums', [auth.secure], albums.listAll);
  app.post('/albums/:id', [auth.secure], albums.buyAlbum);
  app.get('/users/:user_id/albums', [auth.secure, auth.verifyId], albums.listOwn);
  app.get('/users/albums/:id/photos', [auth.secure], albums.listPhotos);
};
