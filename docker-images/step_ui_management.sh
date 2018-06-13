#!/bin/bash

docker kill $(docker ps -q)
docker rm $(docker ps -a -q)

docker build -t res/apache_php ./apache-php/
docker build -t res/express_dynamic ./express-dynamic/
docker build -t res/apache_reverse_proxy ./apache-reverse-proxy/

docker run -d res/apache_php

docker run -d res/express_dynamic
docker run -d res/express_dynamic
docker run -d res/express_dynamic
docker run -d res/express_dynamic

php apache-reverse-proxy/command.php

docker volume create portainer_data
docker run -d -p 9000:9000 --name portainer --restart always -v /var/run/docker.sock:/var/run/docker.sock -v portainer_data:/data portainer/portainer

echo "Connect on localhost:9000"
echo "Username: admin"
echo "password: password"