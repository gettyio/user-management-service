import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import Promise from 'bluebird';
import mongoose from '../config';
import userFactory from '../../../src/models/user';
import userModel from '../../../src/models/user/userModel';

chai.should();
chai.use(chaiAsPromised);

const UserModel = userModel({ mongoose });
const User = userFactory({ User: UserModel });

describe('user model spec', () => {
  beforeEach(() => {
    return Promise.all([
      UserModel.findOneAndRemove({ username: 'cthulhu' }),
      UserModel.findOneAndRemove({ username: 'duplicateUser' })
    ]);
  });

  it('should save an user', () => {
    return User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    })
    .then((user) => {
      user.should.exist;
      user.should.have.deep.property('role', 'user');
      user.should.have.deep.property('created_at');
      user.should.have.deep.property('updated_at');
    });
  });

  it('should throw an error when username is duplicate', () => {
    return User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    })
    .then(() =>
      User.save({
        username: 'cthulhu',
        password: 'otherpass',
        email: 'another@email.com'
      })
    )
    .should.be.rejected
    .then((error) => {
      error.should.have.deep.property('isBoom', true);
      error.should.have.deep.property('output.statusCode', 422);
    });
  });

  it('should find one user by id', () => {
    return User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    })
    .then(userSaved => [
      userSaved,
      User.findOneById(userSaved._id)
    ])
    .spread((userSaved, userFound) =>
      userFound.should.be.deep.equal(userSaved)
    );
  });

  it('should find one user by email', () => {
    return User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    })
    .then(userSaved => [
      userSaved,
      User.findOneByEmailOrUsername(userSaved.email)
    ])
    .spread((userSaved, userFound) =>
      userFound.should.be.deep.equal(userSaved)
    );
  });

  it('should find one user by username', () => {
    return User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    })
    .then(userSaved => [
      userSaved,
      User.findOneByEmailOrUsername(userSaved.username)
    ])
    .spread((userSaved, userFound) =>
      userFound.should.be.deep.equal(userSaved)
    );
  });

  it('should update an user', () => {
    return User.save({
      username: 'cthulhu',
      password: 'abc123',
      email: 'cthulhu@example.com'
    })
    .then(userSaved =>
      User.update(userSaved._id, { email: 'other_email@email.com' })
    )
    .then(userUpdated =>
      userUpdated.should.have.deep.property('email', 'other_email@email.com')
    );
  });

  it('should fail when updating with duplicate keys', () => {
    return User.save({
      username: 'duplicateUser',
      password: 'abc123',
      email: 'duplicate@email.com'
    })
    .then(() =>
      User.save({
        username: 'cthulhu',
        password: 'abc123',
        email: 'cthulhu@example.com'
      })
    )
    .then(userSaved =>
      User.update(userSaved._id, { email: 'duplicate@email.com' })
    )
    .should.be.rejected
    .then((error) => {
      error.should.have.deep.property('isBoom', true);
      error.should.have.deep.property('output.statusCode', 422);
    });
  });
});
