'use strict';

const fetch = require('node-fetch'),
  Purchase = require('../models').Purchase,
  User = require('../models').User,
  errors = require('../errors');

exports.listAll = (req, res, next) => {
  return fetch('https://jsonplaceholder.typicode.com/albums')
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
  return Purchase.findAllPurchasesFromUser(idUser).then(albums => {
    res.status(200);
    res.send({ albums });
  });
};

exports.listPhotos = (req, res, next) => {
  const purchase = {
    UserId: req.user.id,
    albumId: req.params.id
  };
  Purchase.findOneModel(purchase).then(album => {
    if (album) {
      return fetch(`https://jsonplaceholder.typicode.com/photos?albumId=${purchase.albumId}`)
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
    } else {
      res.status(503);
      next(errors.databaseError('the_album_not_was_bought'));
    }
  });
};
