import * as crypto from '../../config/crypto';

export default function ({ mongoose }) {
  const { Schema } = mongoose;
  const UserSchema = new Schema({
    roles: [{ type: String }],
    username: { type: String, index: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, index: true, unique: true },
  }, {
    strict: false,
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  });

  UserSchema.pre('save', true, function preSave(next, done) {
    if (this.password) {
      crypto.hash(this.password)
      .then((password) => {
        this.password = password;
        done();
      })
      .catch(e => done(e));
    }
    next();
  });

  return mongoose.model('User', UserSchema);
}
