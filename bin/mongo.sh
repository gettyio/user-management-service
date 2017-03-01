#! /bin/bash

docker rm -f mongo-test || true && docker run --name mongo-test -d mongo > /dev/null && sleep 2
