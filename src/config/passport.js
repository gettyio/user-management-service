import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

function localLogin({ User, jwt }) {
  passport.use('local-login', new LocalStrategy(
    { usernameField: 'username', passwordField: 'password', passReqToCallback: true },
    (req, username, password, done) => {
      User.validateUserNamePassword(username, password)
      .then(user =>
        done(
            null,
            { authorization: `Bearer ${jwt.encode(user.toJSON())}`, user }
        )
      )
      .catch(e => done({ message: e.message }));
    }
  ));
}

function localSignup({ User, jwt }) {
  passport.use('local-signup', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
    (req, email, password, done) => {
      return User.save(req.body)
      .then(user =>
        done(
          null,
          { authorization: `Bearer ${jwt.encode(user)}`, user }
        )
      )
      .catch(err => done({ message: err.message }));
    }
  ));
}

export default function (deps) {
  localLogin(deps);
  localSignup(deps);
  return passport;
}
