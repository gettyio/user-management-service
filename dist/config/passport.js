'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (deps) {
  localLogin(deps);
  localSignup(deps);
  return _passport2.default;
};

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _passportLocal = require('passport-local');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function localLogin(_ref) {
  var User = _ref.User,
      jwt = _ref.jwt;

  _passport2.default.use('local-login', new _passportLocal.Strategy({ usernameField: 'username', passwordField: 'password', passReqToCallback: true }, function (req, username, password, done) {
    User.validateUserNamePassword(username, password).then(function (user) {
      return done(null, { authorization: 'Bearer ' + jwt.encode(user.toJSON()), user: user });
    }).catch(function (e) {
      return done({ message: e.message });
    });
  }));
}

function localSignup(_ref2) {
  var User = _ref2.User,
      jwt = _ref2.jwt;

  _passport2.default.use('local-signup', new _passportLocal.Strategy({ usernameField: 'email', passwordField: 'password', passReqToCallback: true }, function (req, email, password, done) {
    return User.save(req.body).then(function (user) {
      return done(null, { authorization: 'Bearer ' + jwt.encode(user), user: user });
    }).catch(function (err) {
      return done({ message: err.message });
    });
  }));
}
//# sourceMappingURL=passport.js.map