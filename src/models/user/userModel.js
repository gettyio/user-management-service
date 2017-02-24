import mongoose from 'mongoose';
import * as crypto from '../../config/crypto';

const UserSchema: Schema = new Schema({
  role: { type: String, default: 'user', },
  username: { type: String, index: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, index: true, unique: true },
}, {
  strict: false,
  timestamps: { createdAt: 'created_at' },
});

UserSchema.pre('save', true, async function preSave(next, done) {
  try {
    if (this.password) {
      this.password = await crypto.hash(this.password);
    }
    done();
  } catch (e) {
    done(e);
  }
  next();
});

const User = mongoose.model('User', UserSchema);
export default User;
