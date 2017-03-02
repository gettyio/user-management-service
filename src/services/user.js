import { Router } from 'express';

const router = new Router();

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
    async (err, user) => {
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
  router.post('/login', login.bind(null, deps));
  router.post('/signup', signup.bind(null, deps));
  return router;
}
