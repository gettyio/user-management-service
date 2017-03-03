import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { User, UserModel } from '../config';
import jwtFactory from '../../../src/config/jwt';
import passportFactory from '../../../src/config/passport';
import users from '../../../src/services/user';

chai.should();
chai.use(chaiAsPromised);

const unless = {
  path: [
    { url: /\/signup/ },
    { url: /\/login/ }
  ]
};

const app = express();
const jwt = jwtFactory({ User, secret: 'somesecret' });
const passport = passportFactory({ User, jwt });

app.use(bodyParser.json());
app.use(jwt.decodeJWT.unless(unless));
app.use(jwt.hydrateUser.unless(unless));
app.use(users({ passport }));

describe('user endpoints', () => {
  beforeEach(() => {
    return Promise.all([
      UserModel.findOneAndRemove({ username: 'cthulhu' }),
      UserModel.findOneAndRemove({ username: 'duplicateUser' })
    ]);
  });

  it('should signup an user', () => {
    return request(app)
      .post('/signup')
      .type('json')
      .send({
        username: 'cthulhu',
        password: 'abc123',
        email: 'cthulhu@example.com'
      })
      .expect(201)
      .then((response) => {
        response.should.have.deep.property('body.authorization');
        response.should.have.deep.property('body.user._id');
        response.should.have.deep.property('body.user.username');
        response.should.have.deep.property('body.user.email');
      });
  });

  it('should throw an error if username not defined', () => {
    return request(app)
      .post('/signup')
      .type('json')
      .send({
        password: 'abc123',
        email: 'cthulhu@example.com'
      })
      .expect(400);
  });

  it('should login an user', () => {
    return request(app)
      .post('/signup')
      .type('json')
      .send({
        username: 'cthulhu',
        password: 'abc123',
        email: 'cthulhu@example.com'
      })
      .then(() => request(app)
        .post('/login')
        .type('json')
        .send({
          username: 'cthulhu',
          password: 'abc123'
        })
        .expect(200)
      )
      .then((response) => {
        response.should.have.deep.property('body.authorization');
        response.should.have.deep.property('body.user._id');
        response.should.have.deep.property('body.user.username');
        response.should.have.deep.property('body.user.email');
      });
  });

  it('should fail login if wrong password', () => {
    return request(app)
      .post('/signup')
      .type('json')
      .send({
        username: 'cthulhu',
        password: 'abc123',
        email: 'cthulhu@example.com'
      })
      .then(() => request(app)
        .post('/login')
        .type('json')
        .send({
          username: 'cthulhu',
          password: 'abc124'
        })
        .expect(400)
      );
  });

});
