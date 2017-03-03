'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.compare = exports.hash = undefined;

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var saltRounds = 10;

var hash = exports.hash = _bluebird2.default.promisify(function (password, cb) {
  return _bcrypt2.default.hash(password, saltRounds, cb);
});
/*
export const hashPromise = password => new Promise((resolve, reject) => {
  return bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) return reject(err);
    return resolve(hashedPassword);
  });
});
*/

var compare = exports.compare = _bluebird2.default.promisify(_bcrypt2.default.compare);
//# sourceMappingURL=crypto.js.map