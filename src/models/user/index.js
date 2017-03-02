import boom from 'boom';
import * as crypto from '../../config/crypto';

async function save({ User }, user) {
  try {
    let userDoc = new User(user);
    await userDoc.save();
    userDoc = userDoc.toObject();
    delete userDoc.password;
    return userDoc;
  } catch (err) {
    if (err.code === 11000) {
      throw boom.badData('Duplicate username or email', err);
    }
    throw err;
  }
}

async function findOneById({ User }, idEmailUsername) {
  const user = await User.findOne(
    { _id: idEmailUsername },
    { password: 0 }
  );
  return user.toObject();
}

async function findOneByEmailOrUsername({ User }, idEmailUsername) {
  const user = await User.findOne(
    { $or: [{ email: idEmailUsername }, { username: idEmailUsername }] },
    { password: 0 }
  );
  return user.toObject();
}

async function remove({ User }, id) {
  await User.remove({ _id: id });
}

async function update({ User }, id, updates) {
  try {
    const user = await User.findByIdAndUpdate(id, { $set: updates }, { new: true });
    return user.toObject();
  } catch (err) {
    if (err.code === 11000) {
      throw boom.badData('Duplicate username or email', err);
    }
    throw err;
  }
}

async function validateUserNamePassword({ User }, username, password) {
  const user = await User.findOne({ $or: [{ email: username }, { username }] });
  if (user) {
    const isPasswordValid = await crypto.compare(password.toString(), user.password.toString());
    if (isPasswordValid) {
      user.toJSON = function () {
        const obj = this.toObject();
        delete obj.password;
        return obj;
      };
      return user;
    }
  }
  throw boom.unauthorized('Wrong username/email or password');
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
