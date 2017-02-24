import bcrypt from 'bcrypt';
import Promise from 'bluebird';

const saltRounds = 10;


export const hash = Promise.promisify(
  (password, cb) => bcrypt.hash(password, saltRounds, cb)
);
/*
export const hashPromise = password => new Promise((resolve, reject) => {
  return bcrypt.hash(password, saltRounds, (err, hashedPassword) => {
    if (err) return reject(err);
    return resolve(hashedPassword);
  });
});
*/

export const compare = Promise.promisify(
  bcrypt.compare
);
