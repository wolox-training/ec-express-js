'use strict';

const { check } = require('express-validator/check');

exports.userValidation = [
  check('email', 'email is not valid').isEmail(),
  check('email', 'the email must belong to the wolox domain').contains('@wolox.com.ar'),
  check('password', 'the password must have at least 8 characters').isLength({ min: 8 }),
  check('password', 'the password must be alphanumeric').isAlphanumeric()
];
