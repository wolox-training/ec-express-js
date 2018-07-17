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
    it(`should fail because ${sessionManager.HEADER_NAME} header is not being sent or incorrect`, done => {
      chai
        .request(server)
        .post('/albums/:id')
        .catch(err => {
          err.should.have.status(403);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          done();
        });
    });
  });
  describe('/users/:user_id/albums GET', () => {
    it(`should fail because ${sessionManager.HEADER_NAME} header is not being sent or incorrect`, done => {
      chai
        .request(server)
        .get('/users/1/albums')
        .catch(err => {
          err.should.have.status(403);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          done();
        });
    });
  });
  it('should fail because a normal user cant see the albums of another user', done => {
    helperTest.createUser().then(u => {
      return helperTest.successfullLogin().then(res => {
        chai
          .request(server)
          .get('/users/2/albums')
          .set(sessionManager.HEADER_NAME, `Bearer ${res.headers[sessionManager.HEADER_NAME]}`)
          .catch(err => {
            err.should.have.status(405);
            err.response.should.be.json;
            err.response.body.should.have.property('message');
            err.response.body.should.have.property('internal_code');
            done();
          });
      });
    });
  });
  it('should be succesfull because an admin user can see the albums of another users', done => {
    helperTest.createUser(true).then(u => {
      return helperTest.successfullLogin().then(res => {
        chai
          .request(server)
          .get('/users/2/albums')
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
  it('should be succesfull, a user can see his albums', done => {
    helperTest.createUser(true).then(u => {
      return helperTest.successfullLogin().then(res => {
        chai
          .request(server)
          .get('/users/1/albums')
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
  describe('/users/albums/:id/photos GET', () => {
    it(`should fail because ${sessionManager.HEADER_NAME} header is not being sent or incorrect`, done => {
      chai
        .request(server)
        .get('/users/albums/1/photos')
        .catch(err => {
          err.should.have.status(403);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          done();
        });
    });
    it('should fail because the user havent a bought album', done => {
      helperTest.createUser().then(u => {
        return helperTest.successfullLogin().then(res => {
          chai
            .request(server)
            .get('/users/albums/1/photos')
            .set(sessionManager.HEADER_NAME, `Bearer ${res.headers[sessionManager.HEADER_NAME]}`)
            .catch(err => {
              err.should.have.status(503);
              err.response.should.be.json;
              err.response.body.should.have.property('message', 'the_album_not_was_bought');
              err.response.body.should.have.property('internal_code');
              done();
            });
        });
      });
    });
    it('should be succesfull', done => {
      helperTest.createUser().then(u => {
        return helperTest.successfullLogin().then(log => {
          return helperTest.buyAlbum().then(res => {
            chai
              .request(server)
              .get('/users/albums/1/photos')
              .set(sessionManager.HEADER_NAME, `Bearer ${log.headers[sessionManager.HEADER_NAME]}`)
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
});
