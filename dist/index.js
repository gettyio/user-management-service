'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var secret = _ref.secret,
      unless = _ref.unless,
      app = _ref.app,
      mongoose = _ref.mongoose;

  var User = (0, _user2.default)({ User: (0, _userModel2.default)({ mongoose: mongoose }) });
  var jwt = (0, _jwt2.default)({ User: User, secret: secret });
  var passport = (0, _passport2.default)({ User: User, jwt: jwt });

  app.use(jwt.decodeJWT.unless(unless));
  app.use(jwt.hydrateUser.unless(unless));
  return (0, _user4.default)({ passport: passport });
};

var _userModel = require('./models/user/userModel');

var _userModel2 = _interopRequireDefault(_userModel);

var _user = require('./models/user');

var _user2 = _interopRequireDefault(_user);

var _jwt = require('./config/jwt');

var _jwt2 = _interopRequireDefault(_jwt);

var _passport = require('./config/passport');

var _passport2 = _interopRequireDefault(_passport);

var _user3 = require('./services/user');

var _user4 = _interopRequireDefault(_user3);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
//# sourceMappingURL=index.js.map