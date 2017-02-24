import childProcess from 'child_process';

const exec = childProcess.exec;

export default function (cb) {
  exec('docker inspect --format \'{{ .NetworkSettings.IPAddress }}\' $(docker ps -aqf "name=mongo-test")', (err, out) => {
    cb(out);
  });
}
