const express = require("express");
const bodyParser = require("body-parser");
const readline = require("readline");
const cliProgress = require("cli-progress");
const { pingAll, sendMessage } = require("./misc.js");
var app = express();
var port = undefined;
var name = "undefined";
var members = [];

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.on("line", input => {
    if (input.split(" ")[0] == ">") {
        if (input.split(" ")[1] == "ping") {
            pingAll(input.split(" ")[1], undefined).then(ips => console.log("Found IPs: " + ips));
        }
    } else sendMessage(input, members, port, name);
});

app.set("view engine", "ejs");

app.use(bodyParser.json({ extended: true }));

app.get("/ping", (req, res) => res.json({ online: true, name: name }));

app.post("/msgIn", (req, res) => {
    console.log(req.body.name + ' -> all: ' + req.body.msg);
    res.sendStatus(200);
});

rl.question("Listen port: ", port_ => {
    rl.question("Your name: ", name_ => {
        name = name_;
        port = port_;
        app.listen(port, () => {
            console.log(`App is listening on port ${port}`);
            const pingBar = new cliProgress.SingleBar({}, cliProgress.Presets.shades_classic);
            console.log("Searching members: ");
            pingBar.start(256);
            pingAll(port, pingBar).then(ips => {
                pingBar.stop();
                members = members.concat(ips);
                console.log("Found IPs: " + ips);
            });
        });
    });
});
