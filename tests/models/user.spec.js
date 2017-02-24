// import User from '../../src/models/user';
// import UserModel from '../../src/models/user/userModel';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.should();
chai.use(chaiAsPromised);

describe('user model spec', () => {
  it('should fail', () => {
    const x = 3;
    x.should.be.eq(3);
  });
});
