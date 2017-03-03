'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var mongoose = _ref.mongoose;
  var Schema = mongoose.Schema;

  var UserSchema = new Schema({
    role: { type: String, default: 'user' },
    username: { type: String, index: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true }
  }, {
    strict: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
  });

  UserSchema.pre('save', true, function preSave(next, done) {
    var _this = this;

    if (this.password) {
      crypto.hash(this.password).then(function (password) {
        _this.password = password;
        done();
      }).catch(function (e) {
        return done(e);
      });
    }
    next();
  });

  return mongoose.model('User', UserSchema);
};

var _crypto = require('../../config/crypto');

var crypto = _interopRequireWildcard(_crypto);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
//# sourceMappingURL=userModel.js.map