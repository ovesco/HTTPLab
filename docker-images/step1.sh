#!/bin/bash

docker kill $(docker ps -q)
docker rm $(docker ps -a -q)

docker build -t res/apache_php ./apache-php/
docker run -d -p 8080:80 res/apache_php