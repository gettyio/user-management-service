import Promise from 'bluebird';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import mongoose from 'mongoose';
import config from '../config';
import userFactory from '../../../src/models/user';
import UserModel from '../../../src/models/user/userModel';

chai.should();
chai.use(chaiAsPromised);
const User = userFactory({ User: UserModel });

before(async () => {
  mongoose.Promise = Promise;
  config(url => mongoose.connect(url));
});

describe('user model spec', () => {
  it('should save an user', async () => {
    // const three = 3;
    // three.should.be.eq(3);
    const user = User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    });
    console.log(JSON.stringify(user, null, 2));
    user.should.exist;
  });
});
