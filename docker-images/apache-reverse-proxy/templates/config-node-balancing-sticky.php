<?php
    $statics        = explode('_', getenv('STATICS'));
    $dynamics       = explode('_', getenv('DYNAMICS'));
?>
<VirtualHost *:80>
    ServerName demo.res.ch

    <Location /balancer-manager>
        SetHandler balancer-manager
        Order Deny,Allow
        Deny from all
        Allow from all
    </Location>
    ProxyPass '/balancer-manager' !


    Header add Set-Cookie "ROUTEID=.%{BALANCER_WORKER_ROUTE}e; path=/" env=BALANCER_ROUTE_CHANGED
    <Proxy balancer://dynamic>
        <?php for($i = 0; $i < count($dynamics); $i++) { ?>
            BalancerMember 'http://<?php print $dynamics[$i]; ?>' route=<?php echo ($i+1) . "\n"; ?>
        <?php } ?>
        ProxySet stickysession=ROUTEID
    </Proxy>
    ProxyPass '/api/facts/' 'balancer://dynamic/'
    ProxyPassReverse '/api/facts/' 'balancer://dynamic/'


    <Proxy balancer://static>
        <?php for($i = 0; $i < count($statics); $i++) { ?>
            BalancerMember 'http://<?php print $statics[$i]; ?>'
        <?php } ?>
    </Proxy>
    ProxyPass '/' 'balancer://static/'
    ProxyPassReverse '/' 'balancer://static/'
</VirtualHost>