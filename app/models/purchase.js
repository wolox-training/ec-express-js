'use strict';

const errors = require('../errors');

module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define(
    'Purchase',
    {
      UserId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      albumId: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },
    {}
  );
  Purchase.associate = function(models) {
    Purchase.belongsTo(models.User);
  };
  Purchase.createModel = purchase => {
    return Purchase.findOrCreate({
      where: {
        UserId: purchase.UserId,
        albumId: purchase.albumId
      }
    });
  };
  Purchase.createModel1 = purchase => {
    return Purchase.create(purchase).catch(err => {
      throw errors.savingError();
    });
  };
  Purchase.findOneModel = purchase => {
    return Purchase.findOne(purchase).catch(err => {
      throw errors.databaseError();
    });
  };
  return Purchase;
};
