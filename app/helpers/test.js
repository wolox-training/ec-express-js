const server = require('./../../app'),
  chai = require('chai'),
  helperPassword = require('../helpers/password'),
  User = require('../models').User,
  Purchase = require('../models').Purchase;

exports.successfullLogin = () => {
  return chai
    .request(server)
    .post('/users/sessions')
    .send({
      email: 'email@wolox.com.ar',
      password: '12345678'
    });
};

exports.createUser = admin => {
  const password = '12345678';
  return helperPassword.encrypt(password).then(hash => {
    return User.create({
      firstName: 'firstName',
      lastName: 'lastName',
      password: `${hash}`,
      email: 'email@wolox.com.ar',
      administrator: admin
    });
  });
};

exports.buyAlbum = user => {
  return Purchase.create({
    albumId: 1,
    UserId: 1
  });
};
