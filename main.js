const express = require('express');
const readline = require('readline');
const { pingAll } = require('./misc.js');
const port = 40204;
var app = express();

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', input => {
    if (input.split(' ')[0] == 'ping') pingAll(input.split(' ')[1]).then(ips => console.log("Found IPs: " + ips));
});

app.set('view engine', 'ejs');

app.get('/ping', (req, res) => res.json({ online: true }));

app.listen(port, () => console.log(`App is listening on port ${port}`));