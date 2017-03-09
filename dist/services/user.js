'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (deps) {
  router.post('/login', (0, _expressValidation2.default)(loginSchema), login.bind(null, deps));
  router.post('/signup', (0, _expressValidation2.default)(signupSchema), signup.bind(null, deps));
  return router;
};

var _express = require('express');

var _joi = require('joi');

var _joi2 = _interopRequireDefault(_joi);

var _expressValidation = require('express-validation');

var _expressValidation2 = _interopRequireDefault(_expressValidation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = new _express.Router();

var loginSchema = {
  body: {
    username: _joi2.default.string().required(),
    password: _joi2.default.string().min(6).required()
  }
};

var signupSchema = {
  body: {
    email: _joi2.default.string().email({ minDomainAtoms: 2 }).required(),
    username: _joi2.default.string().required(),
    password: _joi2.default.string().min(6).required()
  }
};

function login(_ref, req, res, next) {
  var passport = _ref.passport;

  return passport.authenticate('local-login', { session: false }, function (err, user) {
    if (err) {
      next(err);
    }
    res.status(200).json(user);
  })(req, res, next);
}

function signup(_ref2, req, res, next) {
  var passport = _ref2.passport;

  return passport.authenticate('local-signup', { session: false }, function (err, user) {
    if (err) {
      next(err);
    }
    try {
      res.status(201).json(user);
    } catch (e) {
      next(e);
    }
  })(req, res, next);
}
//# sourceMappingURL=user.js.map