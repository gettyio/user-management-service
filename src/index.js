import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import UserModel from './models/user/userModel';
import userFactory from './models/user';
import jwtFactory from './config/jwt';
import passportFactory from './config/passport';
import users from './services/user';

mongoose.connect('mongodb://172.17.0.2/local');
const app = express();
const User = userFactory({ User: UserModel });
const jwt = jwtFactory({ User, secret: 'somesecret' });
const passport = passportFactory({ User, jwt });

const UNLESS_ENDPOINTS = {
  path: [
    { url: /\/signup/ },
    { url: /\/login/ }
  ]
};

app.use(bodyParser.json());
app.use(jwt.decodeJWT.unless(UNLESS_ENDPOINTS));
app.use(jwt.hydrateUser.unless(UNLESS_ENDPOINTS));
app.use(users({ passport }));
app.use((err, req, res, next) => {
  res.status(400).json(err);
  next();
});

app.listen(8000, () => console.log('magic has started'));
