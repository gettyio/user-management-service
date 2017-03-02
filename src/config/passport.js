import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

function localLogin({ User, jwt }) {
  passport.use('local-login', new LocalStrategy(
    { usernameField: 'username', passwordField: 'password', passReqToCallback: true },
    async (req, username, password, done) => {
      try {
        const user = await User.validateUserNamePassword(username, password);

        done(
          null,
          { authorization: `Bearer ${jwt.encode(user.toJSON())}`, user }
        );
      } catch (e) {
        done({ message: e.message });
      }
    }
  ));
}

function localSignup({ User, jwt }) {
  passport.use('local-signup', new LocalStrategy(
    { usernameField: 'email', passwordField: 'password', passReqToCallback: true },
    async (req, email, password, done) => {
      try {
        const user = await User.save(req.body);
        done(
          null,
          { authorization: `Bearer ${jwt.encode(user)}`, user }
        );
      } catch (e) {
        done({ message: e.message });
      }
    }
  ));
}

export default function (deps) {
  localLogin(deps);
  localSignup(deps);
}
