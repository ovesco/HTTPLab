#!/bin/bash

docker kill $(docker ps -q)
docker rm $(docker ps -a -q)

docker build -t res/apache_php ./apache-php/
docker build -t res/express_dynamic ./express-dynamic/
docker build -t res/apache_reverse_proxy ./apache-reverse-proxy/

docker run -d res/apache_php
docker run -d res/express_dynamic
docker run -d -e STATIC_APP=172.17.0.2:80 -e DYNAMIC_APP=172.17.0.3:3000 -p 8080:80 -t res/apache_reverse_proxy