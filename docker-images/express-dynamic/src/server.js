const Chance    = require('chance');
const Express   = require('express');
const OS        = require('os');

let chance      = new Chance();
let app         = new Express();
let ipaddress   = null;
let ifaces      = OS.networkInterfaces();
Object.keys(ifaces).forEach(function(ifname) {

    let alias = 0;

    ifaces[ifname].forEach(function(iface) {

        if(iface.family != 'IPv4' || iface.internal !== false)
            return;

        ipaddress   = iface.address;
    });
});


app.get('/', function(req, res) {

    let response    = [];

    for(let i = 0; i < 4; i++)
        response.push({
            title: chance.sentence({words: chance.integer({min:3, max: 6})}),
            content: chance.paragraph({sentence: 2}),
            author: chance.name()
        });

    res.send({
        ipAddress: ipaddress,
        data: response
    });
});

app.listen(3000, function() {
    console.log("Random facts server running on port 3000");
});