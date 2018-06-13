#!/bin/bash

docker kill $(docker ps -q)
docker rm $(docker ps -a -q)

docker build -t res/apache_php ./apache-php/
docker build -t res/express_dynamic ./express-dynamic/
docker build -t res/apache_reverse_proxy ./apache-reverse-proxy/

docker run -d res/apache_php
docker run -d res/apache_php

docker run -d res/express_dynamic
docker run -d res/express_dynamic
docker run -d res/express_dynamic

php apache-reverse-proxy/command.php