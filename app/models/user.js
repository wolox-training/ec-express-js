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
      },
      administrator: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      },
      hash: {
        type: DataTypes.STRING
      }
    },
    {}
  );

  User.associate = function(models) {
    User.hasMany(models.Purchase);
  };
  User.createModel = user => {
    return User.create(user).catch(err => {
      throw errors.savingError();
    });
  };
  User.getOne = email => {
    return User.findOne({ where: { email } });
  };
  User.findByEmail = email => {
    return User.findOne({ where: { email } });
  };
  User.findAllUsers = (limit = 3, offset = 0) => {
    return User.findAll({
      offset,
      limit,
      order: ['id']
    });
  };
  User.updateHash = (email, hash) => {
    return User.update(
      {
        hash
      },
      {
        where: {
          email
        }
      }
    ).catch(err => {
      throw errors.updateError();
    });
  };
  User.updateModel = user => {
    return User.update(
      {
        administrator: 't'
      },
      {
        where: {
          email: user.email
        }
      }
    );
  };
  return User;
};
