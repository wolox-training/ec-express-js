'use strict';

const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );

  User.createModel = user => {
    return User.create(user).catch(err => {
      throw errors.savingError();
    });
  };
  User.findOneModel = email => {
    return User.findOne({ where: { email } }).then(result => {
      if (result !== null) {
        throw errors.findingError();
      }
    });
  };
  return User;
};
