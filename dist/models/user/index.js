'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (deps) {
  return {
    save: save.bind(null, deps),
    findOneById: findOneById.bind(null, deps),
    findOneByEmailOrUsername: findOneByEmailOrUsername.bind(null, deps),
    remove: remove.bind(null, deps),
    update: update.bind(null, deps),
    validateUserNamePassword: validateUserNamePassword.bind(null, deps)
  };
};

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

var _crypto = require('../../config/crypto');

var crypto = _interopRequireWildcard(_crypto);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function save(_ref, user) {
  var User = _ref.User;

  var userDoc = new User(user);
  return userDoc.save().then(function () {
    userDoc = userDoc.toObject();
    delete userDoc.password;
    return userDoc;
  }).catch(function (err) {
    if (err.code === 11000) {
      throw _boom2.default.badData('Duplicate username or email', err);
    }
    throw err;
  });
}

function findOneById(_ref2, idEmailUsername) {
  var User = _ref2.User;

  return User.findOne({ _id: idEmailUsername }, { password: 0 }).then(function (user) {
    return user.toObject();
  });
}

function findOneByEmailOrUsername(_ref3, idEmailUsername) {
  var User = _ref3.User;

  return User.findOne({ $or: [{ email: idEmailUsername }, { username: idEmailUsername }] }, { password: 0 }).then(function (user) {
    return user.toObject();
  });
}

function remove(_ref4, id) {
  var User = _ref4.User;

  return User.remove({ _id: id });
}

function update(_ref5, id, updates) {
  var User = _ref5.User;

  return User.findByIdAndUpdate(id, { $set: updates }, { new: true }).then(function (user) {
    return user.toObject();
  }).catch(function (err) {
    if (err.code === 11000) {
      throw _boom2.default.badData('Duplicate username or email', err);
    }
    throw err;
  });
}

function validateUserNamePassword(_ref6, username, password) {
  var User = _ref6.User;

  return User.findOne({ $or: [{ email: username }, { username: username }] }).then(function (user) {
    if (user) {
      return [user, crypto.compare(password.toString(), user.password.toString())];
    }
    return [null, null];
  }).spread(function (user, isPasswordValid) {
    if (user && isPasswordValid) {
      user.toJSON = function () {
        var obj = this.toObject();
        delete obj.password;
        return obj;
      };
      return user;
    }
    throw _boom2.default.unauthorized('Wrong username/email or password');
  });
}
//# sourceMappingURL=index.js.map