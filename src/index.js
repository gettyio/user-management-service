import userModel from './models/user/userModel';
import userFactory from './models/user';
import jwtFactory from './config/jwt';
import passportFactory from './config/passport';
import users from './services/user';

export default function ({ secret, unless, app, mongoose }) {
  const User = userFactory({ User: userModel({ mongoose }) });
  const jwt = jwtFactory({ User, secret });
  const passport = passportFactory({ User, jwt });

  app.use(jwt.decodeJWT.unless(unless));
  app.use(jwt.hydrateUser.unless(unless));
  return users({ passport });
}
