const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  sessionManager = require('./../app/services/sessionManager'),
  should = chai.should(),
  User = require('./../app/models').User,
  errors = require('./../app/errors'),
  helperPassword = require('./../app/helpers/password'),
  helperTest = require('./../app/helpers/test');

describe('users', () => {
  describe('/users POST', () => {
    it('should fail login because the password is invalid', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'firstName1',
          lastName: 'lastName1',
          email: 'email1@wolox.com.ar',
          password: 'INVALID'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          done();
        });
    });

    it('should fail login because the email is invalid and does not belong to the wolox domain', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'firstName1',
          lastName: 'lastName1',
          email: 'INVALID',
          password: 'password'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          done();
        });
    });

    it('all parameters are needed', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: '',
          lastName: '',
          email: '',
          password: ''
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          done();
        });
    });

    it('should fail because email already exists', done => {
      helperTest.createUser().then(u => {
        chai
          .request(server)
          .post('/users')
          .send({
            firstName: 'firstName',
            lastName: 'lastName',
            password: 'password',
            email: 'email@wolox.com.ar'
          })
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('message', 'email_already_exists');
            err.response.body.should.have.property('internal_code');
            done();
          });
      });
    });

    it('should be succesfull', done => {
      chai
        .request(server)
        .post('/users')
        .send({
          firstName: 'Name',
          lastName: 'Lastname',
          email: 'email1@wolox.com.ar',
          password: '12345678'
        })
        .then(res =>
          User.findOne({
            where: {
              firstName: 'Name',
              lastName: 'Lastname',
              email: 'email1@wolox.com.ar'
            }
          }).then(user => {
            if (user) {
              return helperPassword.compare('12345678', user.password).then(isValid => {
                if (isValid) {
                  res.should.have.status(200);
                  dictum.chai(res);
                  done();
                }
              });
            }
          })
        );
    });
  });
  describe('/users/sessions POST', () => {
    it('should fail login because of invalid password', done => {
      helperTest.createUser().then(u => {
        chai
          .request(server)
          .post('/users/sessions')
          .send({
            email: 'email@wolox.com.ar',
            password: 'INVALID'
          })
          .catch(err => {
            err.should.have.status(400);
            err.response.should.be.json;
            err.response.body.should.have.property('message');
            err.response.body.should.have.property('internal_code');
            done();
          });
      });
    });

    it('should fail login because of invalid email', done => {
      chai
        .request(server)
        .post('/users/sessions')
        .send({
          email: 'invalid',
          password: '12345678'
        })
        .catch(err => {
          err.should.have.status(400);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          done();
        });
    });

    it('should be succesfull', done => {
      helperTest.createUser().then(u => {
        return helperTest.successfullLogin().then(res => {
          res.should.have.status(200);
          res.should.be.json;
          dictum.chai(res);
          done();
        });
      });
    });
  });
  describe('/users GET', () => {
    it(`should fail because ${sessionManager.HEADER_NAME} header is not being sent or incorrect`, done => {
      chai
        .request(server)
        .get('/users')
        .catch(err => {
          err.should.have.status(403);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          done();
        });
    });

    it('should be successful', done => {
      helperTest.createUser().then(u => {
        return helperTest.successfullLogin().then(res => {
          chai
            .request(server)
            .get('/users')
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
  describe('/admin/users POST', () => {
    it(`should fail because ${sessionManager.HEADER_NAME} header is not being sent or incorrect`, done => {
      chai
        .request(server)
        .post('/admin/users')
        .catch(err => {
          err.should.have.status(403);
          err.response.should.be.json;
          err.response.body.should.have.property('message');
          err.response.body.should.have.property('internal_code');
          done();
        });
    });

    it('should be successful', done => {
      helperTest.createUser(true).then(u => {
        return helperTest.successfullLogin().then(res => {
          chai
            .request(server)
            .post('/admin/users')
            .send({
              firstName: 'name',
              lastName: 'lastname',
              email: 'anotherEmail@wolox.com.ar',
              password: '12345678'
            })
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
