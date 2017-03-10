'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (deps) {
  var objReturn = {
    encode: encode.bind(null, deps),
    decodeJWT: decodeJWT(deps),
    hydrateUser: hydrateUser.bind(null, deps)
  };
  objReturn.hydrateUser.unless = _expressUnless2.default;
  return objReturn;
};

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _expressUnless = require('express-unless');

var _expressUnless2 = _interopRequireDefault(_expressUnless);

var _boom = require('boom');

var _boom2 = _interopRequireDefault(_boom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var decodeJWT = function decodeJWT(_ref) {
  var secret = _ref.secret;
  return (0, _expressJwt2.default)({ secret: secret, credentialsRequired: false });
};

decodeJWT.unless = _expressUnless2.default;

function encode(_ref2, data) {
  var secret = _ref2.secret;

  return _jsonwebtoken2.default.sign(data, secret);
}

function hydrateUser(_ref3, req, res, next) {
  var User = _ref3.User;

  try {
    if (!req.user) {
      throw _boom2.default.unauthorized('Token is either missing or invalid');
    }

    var _ref4 = req.user._id && req.user.roles ? req.user : req.user._doc,
        _id = _ref4._id;

    User.findOneById(_id).then(function (user) {
      req.user = user;

      if (req.user) {
        return next();
      }

      throw _boom2.default.unauthorized('Invalid token');
    });
  } catch (e) {
    next(e);
  }
}
//# sourceMappingURL=jwt.js.map