import childProcess from 'child_process';
import mongoose from 'mongoose';
import Promise from 'bluebird';
import userFactory from '../../src/models/user';
import userModel from '../../src/models/user/userModel';

mongoose.Promise = Promise;

const exec = childProcess.exec;


/**
 * get the mongo container ip
 */
function setupMongo() {
  exec('docker inspect --format \'{{ .NetworkSettings.IPAddress }}\' $(docker ps -aqf "name=mongo-test")', (err, out) => {
    mongoose.connect(`mongodb://${out}`);
  });
}

setupMongo();

export default mongoose;
export const UserModel = userModel({ mongoose });
export const User = userFactory({ User: UserModel });
