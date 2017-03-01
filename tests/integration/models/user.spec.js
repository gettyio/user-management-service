import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import '../config';
import userFactory from '../../../src/models/user';
import UserModel from '../../../src/models/user/userModel';

chai.should();
chai.use(chaiAsPromised);

const User = userFactory({ User: UserModel });

describe('user model spec', () => {
  beforeEach(async () => {
    await UserModel.findOneAndRemove({ username: 'cthulhu' });
    await UserModel.findOneAndRemove({ username: 'duplicateUser' });
  });

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
    error.should.have.deep.property('output.statusCode', 422);
  });

  it('should find one user by id', async () => {
    const userSaved = await User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    });
    const userFound = await User.findOneById(userSaved._id);

    userFound.should.be.deep.equal(userSaved);
  });

  it('should find one user by email', async () => {
    const userSaved = await User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    });
    const userFound = await User.findOneByEmailOrUsername(userSaved.email);

    userFound.should.be.deep.equal(userSaved);
  });

  it('should find one user by username', async () => {
    const userSaved = await User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    });
    const userFound = await User.findOneByEmailOrUsername(userSaved.username);

    userFound.should.be.deep.equal(userSaved);
  });

  it('should update an user', async () => {
    const userSaved = await User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    });

    const userUpdated = await User.update(userSaved._id, { email: 'other_email@email.com' });
    userUpdated.should.have.deep.property('email', 'other_email@email.com');
  });

  it('should fail when updating with duplicate keys', async () => {
    await User.save({
      username: 'duplicateUser',
      password: 'abc123',
      email: 'duplicate@email.com'
    });
    const userSaved = await User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    });
    const result = User.update(userSaved._id, { email: 'duplicate@email.com' });
    const error = await result.should.be.rejected;
    error.should.have.deep.property('isBoom', true);
    error.should.have.deep.property('output.statusCode', 422);
  });
});
