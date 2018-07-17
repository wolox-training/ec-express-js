'use strict';

const fetch = require('node-fetch'),
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
