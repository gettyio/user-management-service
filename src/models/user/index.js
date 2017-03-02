import boom from 'boom';
import * as crypto from '../../config/crypto';

function save({ User }, user) {
  let userDoc = new User(user);
  return userDoc.save()
  .then(() => {
    userDoc = userDoc.toObject();
    delete userDoc.password;
    return userDoc;
  })
  .catch((err) => {
    if (err.code === 11000) {
      throw boom.badData('Duplicate username or email', err);
    }
    throw err;
  });
}

function findOneById({ User }, idEmailUsername) {
  return User.findOne(
    { _id: idEmailUsername },
    { password: 0 }
  )
  .then(user => user.toObject());
}

function findOneByEmailOrUsername({ User }, idEmailUsername) {
  return User.findOne(
    { $or: [{ email: idEmailUsername }, { username: idEmailUsername }] },
    { password: 0 }
  )
  .then(user => user.toObject());
}

function remove({ User }, id) {
  return User.remove({ _id: id });
}

function update({ User }, id, updates) {
  return User.findByIdAndUpdate(id, { $set: updates }, { new: true })
  .then(user => user.toObject())
  .catch((err) => {
    if (err.code === 11000) {
      throw boom.badData('Duplicate username or email', err);
    }
    throw err;
  });
}

function validateUserNamePassword({ User }, username, password) {
  return User.findOne({ $or: [{ email: username }, { username }] })
  .then((user) => {
    if (user) {
      return [
        user,
        crypto.compare(password.toString(), user.password.toString())
      ];
    }
    return [null, null];
  })
  .spread((user, isPasswordValid) => {
    if (user && isPasswordValid) {
      user.toJSON = function () {
        const obj = this.toObject();
        delete obj.password;
        return obj;
      };
      return user;
    }
    throw boom.unauthorized('Wrong username/email or password');
  });
}

export default function (deps) {
  return {
    save: save.bind(null, deps),
    findOneById: findOneById.bind(null, deps),
    findOneByEmailOrUsername: findOneByEmailOrUsername.bind(null, deps),
    remove: remove.bind(null, deps),
    update: update.bind(null, deps),
    validateUserNamePassword: validateUserNamePassword.bind(null, deps)
  };
}
