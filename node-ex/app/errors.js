const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.SAVING_ERROR = 'saving_error';
exports.savingError = message => internalError(message, exports.SAVING_ERROR);

exports.FINDING_ERROR = 'the email already exists';
exports.findingError = message => internalError(message, exports.FINDING_ERROR);

exports.FINDING_EMAIL_ERROR = 'the email is not registred';
exports.findingEmailError = message => internalError(message, exports.FINDING_EMAIL_ERROR);

exports.INVALID_USER = 'invalid_user';
exports.invalidUser = internalError('Invalid username or password', exports.INVALID_USER);
