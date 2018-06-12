const Chance    = require('chance');
const Express   = require('express');

let chance      = new Chance();
let app         = new Express();

app.get('/', function(req, res) {

    let response    = [];

    for(let i = 0; i < 4; i++)
        response.push({
            title: chance.sentence({words: chance.integer({min:3, max: 6})}),
            content: chance.paragraph({sentence: 2}),
            author: chance.name()
        });

    res.send(response);
});

app.listen(3000, function() {
    console.log("Random facts server running on port 3000");
});