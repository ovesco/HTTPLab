#!/bin/bash

docker kill $(docker ps -q)
docker rm $(docker ps -a -q)


docker build -t res/express_dynamic ./express-dynamic/
docker run -d -p 3000:3000 res/express_dynamic