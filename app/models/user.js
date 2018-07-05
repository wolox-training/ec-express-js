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

  User.associate = function(models) {};
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
  User.findByEmail = email => {
    return User.findOne({ where: { email } }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  User.findAllUsers = (limit = 3, offset = 0) => {
    return User.findAll({
      offset,
      limit,
      order: ['id']
    }).catch(err => {
      throw errors.databaseError(err.detail);
    });
  };
  return User;
};
