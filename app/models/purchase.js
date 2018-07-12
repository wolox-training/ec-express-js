'use strict';

const errors = require('../errors');
const User = require('../models').User;

module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define(
    'Purchase',
    {
      UserId: {
        type: DataTypes.INTEGER,
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
  Purchase.findOneModel = purchase => {
    const albumId = purchase.albumId;
    const UserId = purchase.UserId;
    return Purchase.findOne({ where: { UserId, albumId } }).catch(err => {
      throw errors.databaseError();
    });
  };
  Purchase.findAllPurchasesFromUser = UserId => {
    return Purchase.findAll({ where: { UserId } }).catch(err => {
      throw errors.databaseError();
    });
  };
  return Purchase;
};
