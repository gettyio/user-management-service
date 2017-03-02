import { Router } from 'express';
import Joi from 'joi';
import validate from 'express-validation';

const router = new Router();

const loginSchema = {
  body: {
    username: Joi.string().required(),
    password: Joi.string().min(6).required()
  }
};

const signupSchema = {
  body: {
    email: Joi.string().email({ minDomainAtoms: 2 }).required(),
    username: Joi.string().required(),
    password: Joi.string().min(6).required()
  }
};

function login({ passport }, req, res, next) {
  return passport.authenticate('local-login', { session: false },
    (err, user) => {
      if (err) {
        res.status(err.status || 400).json(err);
      }
      res.status(200).json(user);
    }
  )(req, res, next);
}

function signup({ passport }, req, res, next) {
  return passport.authenticate('local-signup', { session: false },
    (err, user) => {
      if (err) {
        res.status(err.status || 400).json(err);
      }
      try {
        res.status(201).json(user);
      } catch (e) {
        res.status(e.status || 400).json(e);
      }
    }
  )(req, res, next);
}

export default function (deps) {
  router.post('/login', validate(loginSchema), login.bind(null, deps));
  router.post('/signup', validate(signupSchema), signup.bind(null, deps));
  return router;
}
