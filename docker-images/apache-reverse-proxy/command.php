<?php

function deal(array $data, $port) {

    $return = [];

    for($i = 0; $i < count($data); $i++) {

        $result = exec("docker inspect " . $data[$i] . " | grep \"[^Secondary]IPAddress\"");
        $result = trim($result);
        $result = substr($result, 14, 10);

        $return[] = $result . ":" . $port;
    }

    return implode("_", $return);
}

$statics    = [];
$dynamics   = [];

exec('docker ps --filter ancestor=res/apache_php --format "{{.ID}}"', $statics);
exec('docker ps --filter ancestor=res/express_dynamic --format "{{.ID}}"', $dynamics);

print "docker run -d -p 8080:80 -e STATICS=" . deal($statics, 80) . " -e DYNAMICS=" . deal($dynamics, 3000) . " res/apache_reverse_proxy\n";