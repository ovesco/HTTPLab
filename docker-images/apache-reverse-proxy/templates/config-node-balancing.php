<?php
    $statics        = explode('_', getenv('STATICS'));
    $dynamics       = explode('_', getenv('DYNAMICS'));
?>
<VirtualHost *:80>
    ServerName demo.res.ch

    <Location "/balancer-manager">
        SetHandler balancer-manager
        Require host demo.res.ch
    </Location>

    <Proxy balancer://dynamic>
        <?php for($i = 0; $i < count($dynamics); $i++) { ?>
            BalancerMember 'http://<?php print $dynamics[$i]; ?>'
        <?php } ?>
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