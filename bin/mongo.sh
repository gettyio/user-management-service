#! /bin/bash

MONGO_ID='docker ps -aqf "name=mongo-test"'
MONGO_IP="docker inspect --format '{{ .NetworkSettings.IPAddress }}' $(eval $MONGO_ID)"

if [[ $(eval $MONGO_ID) == '' ]]; then
  echo "Creating mongo container"
  docker run --name mongo-test -d mongo && sleep 5
elif [[ $(eval $MONGO_IP) == '' ]]; then
  echo "Starting mongo container"
  docker start mongo-test && sleep 5
fi
