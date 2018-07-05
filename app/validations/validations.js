const { check } = require('express-validator/check');

exports.userValidation = [
  check('firstName')
    .not()
    .isEmpty(),
  check('lastName')
    .not()
    .isEmpty(),
  check('email', 'email_is_not_valid').isEmail(),
  check('email', 'the_email_must_belong_to_the_wolox_domain').contains('@wolox.com.ar'),
  check('password', 'the_password_must_have_at_least_8_characters').isLength({ min: 8 }),
  check('password', 'the_password_must_be_alphanumeric').isAlphanumeric()
];
