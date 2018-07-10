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
  return Purchase;
};
