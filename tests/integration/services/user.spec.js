import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import request from 'supertest';
import express from 'express';
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
    request(app)
      .post('/signup')
      .set('Accept', 'application/json')
      .expect(201)
      .then((response) => {
        response.should.have.deep.property('authorization');
      });
  });
});
