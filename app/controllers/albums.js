'use strict';

const fetch = require('node-fetch'),
  Purchase = require('../models').Purchase,
  User = require('../models').User,
  errors = require('../errors');

exports.listAll = (req, res, next) => {
  fetch('https://jsonplaceholder.typicode.com/albums')
    .then(response => response.json())
    .then(json => {
      res.status(200);
      res.send(json);
      res.end();
    })
    .catch(err => {
      res.status(500);
      next(errors.defaultError('server_response_error'));
    });
};

exports.buyAlbum = (req, res, next) => {
  const purchase = {
    UserId: req.user.id,
    albumId: req.params.id
  };
  return Purchase.createModel(purchase).then(p => {
    const created = p[1];
    if (created) {
      res.send({ purchased_album: `${purchase.albumId}` });
      res.status(200);
    } else {
      next(errors.defaultError('user_already_bought_this_album'));
      res.status(500);
    }
    res.end();
  });
};

exports.listOwn = (req, res, next) => {
  const idUser = req.params.user_id;
  Purchase.findAllPurchasesFromUser(idUser).then(albums => {
    res.status(200);
    res.send({ albums });
  });
};
