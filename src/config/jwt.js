import jwt from 'jsonwebtoken';
import expressjwt from 'express-jwt';
import unless from 'express-unless';
import boom from 'boom';

const decodeJWT = ({ secret }) => expressjwt({ secret, credentialsRequired: false });

decodeJWT.unless = unless;

function encode({ secret }, data) {
  return jwt.sign(data, secret);
}

async function hydrateUser({ User }, req, res, next) {
  /* eslint-disable no-param-reassign */
  try {
    if (!req.user) {
      throw boom.unauthorized('Token is either missing or invalid');
    }
    const { _id } = req.user._id && req.user.role ? req.user : req.user._doc;

    req.user = await User.findOneById(_id);

    if (req.user) {
      next();
    } else {
      throw boom.unauthorized('Invalid token');
    }
  } catch (e) {
    next(e);
  }
}


export default function (deps) {
  const objReturn = {
    encode: encode.bind(null, deps),
    decodeJWT: decodeJWT(deps),
    hydrateUser: hydrateUser.bind(null, deps)
  };
  objReturn.hydrateUser.unless = unless;
  return objReturn;
}
