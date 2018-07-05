const chai = require('chai'),
  dictum = require('dictum.js'),
  server = require('./../app'),
  sessionManager = require('./../app/services/sessionManager'),
  should = chai.should(),
  User = require('./../app/models').User,
  errors = require('./../app/errors'),
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
        .then(res => {
          res.should.have.status(200);
          dictum.chai(res);
        })
        .then(() => done());
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
        helperTest
          .successfullLogin()
          .then(res => {
            res.should.have.status(200);
            res.should.be.json;
            dictum.chai(res);
          })
          .then(() => done());
      });
    });
  });
});
