<?php

function deal(array $data, $type, $port) {

    print "Scanning for $type containers";
    $return = [];

    for($i = 0; $i < count($data); $i++) {

        $result = exec("docker inspect " . $data[$i] . " | grep \"[^Secondary]IPAddress\"");
        $result = trim($result);
        $result = substr($result, 14, 10);
        $result = $result . ":" . $port;

        print $result;
        $return[] = $result;
    }

    return implode("_", $return);
}

$statics    = [];
$dynamics   = [];

exec('docker ps --filter ancestor=res/apache_php --format "{{.ID}}"', $statics);
exec('docker ps --filter ancestor=res/express_dynamic --format "{{.ID}}"', $dynamics);

$command = "docker run -d -p 8080:80 -e STATICS=" . deal($statics, "Statics", 80) . " -e DYNAMICS=" . deal($dynamics, "Dynamics", 3000) . " res/apache_reverse_proxy";
exec($command);