const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  sessionManager = require('./../app/services/sessionManager'),
  should = chai.should(),
  helperTest = require('./../app/helpers/test'),
  User = require('./../app/models').User,
  errors = require('./../app/errors');

describe('albums', () => {
  describe('/albums GET', () => {
    it('should be succesfull', done => {
      helperTest.createUser().then(u => {
        return helperTest.successfullLogin().then(res => {
          chai
            .request(server)
            .get('/albums')
            .set(sessionManager.HEADER_NAME, `Bearer ${res.headers[sessionManager.HEADER_NAME]}`)
            .then(response => {
              response.should.have.status(200);
              response.should.be.json;
              dictum.chai(response);
              done();
            });
        });
      });
    });

    it(`should fail because ${sessionManager.HEADER_NAME} header is not being sent or incorrect`, done => {
      chai
        .request(server)
        .get('/albums')
        .catch(err => {
          err.should.have.status(403);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          done();
        });
    });
  });
  describe('/albums/:id POST', () => {
    it('should be succesfull', done => {
      helperTest.createUser().then(u => {
        return helperTest.successfullLogin().then(res => {
          chai
            .request(server)
            .post('/albums/3')
            .set(sessionManager.HEADER_NAME, `Bearer ${res.headers[sessionManager.HEADER_NAME]}`)
            .then(response => {
              response.should.have.status(200);
              response.should.be.json;
              dictum.chai(response);
              done();
            });
        });
      });
    });
  });
});
