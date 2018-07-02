const internalError = (message, internalCode) => ({
  message,
  internalCode
});

exports.DEFAULT_ERROR = 'default_error';
exports.defaultError = message => internalError(message, exports.DEFAULT_ERROR);

exports.SAVING_ERROR = 'saving_error';
exports.savingError = message => internalError(message, exports.SAVING_ERROR);

exports.INVALID_USER = 'invalid_user';
exports.invalidUser = () => internalError('invalid_username_or_password', exports.INVALID_USER);

exports.HEADER_NOT_BEING_SENT_OR_INCORRECT = 'header_not_being_sent_or_incorrect';
exports.headerError = () =>
  internalError('header_not_being_sent_or_incorrect', exports.HEADER_NOT_BEING_SENT_OR_INCORRECT);

exports.PERMISSON_ERROR = 'permisson_error';
exports.permissonError = () => internalError('permisson_error', exports.PERMISSON_ERROR);

exports.UPDATE_ERROR = 'update_error';
exports.updateError = () => internalError('update_error', exports.UPDATE_ERROR);

exports.DATABASE_ERROR = 'database_error';
exports.databaseError = message => internalError(message, exports.DATABASE_ERROR);
