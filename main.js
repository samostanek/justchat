express = require('express');
var app = express();
const readline = require('readline');
const port = 80;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on('line', (input) => {
    console.log(`Received: ${input}`);
});

app.set('view engine', 'ejs');

app.get('/ping', (req, res) => res.json({ online: true }));

app.listen(port, () => console.log(`App is listening on port ${port}`)); ``