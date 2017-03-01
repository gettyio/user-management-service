import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import '../config';
import userFactory from '../../../src/models/user';
import UserModel from '../../../src/models/user/userModel';

chai.should();
chai.use(chaiAsPromised);

const User = userFactory({ User: UserModel });


describe('user model spec', () => {
  it('should save an user', async () => {
    const user = await User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    });
    user.should.exist;
    user.should.have.deep.property('role', 'user');
    user.should.have.deep.property('created_at');
    user.should.have.deep.property('updated_at');
  });

  it('should throw an error when username is duplicate', async () => {
    await User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    });
    const result = User.save({
      username: 'cthulhu',
      password: 'otherpass',
      email: 'another@email.com'
    });
    const error = await result.should.be.rejected;

    error.should.have.deep.property('isBoom', true);
    // error.should.be.rejected;
  });
});
