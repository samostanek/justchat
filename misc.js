const ip = require("ip");
const http = require("http");

function ping(options, onResult) {
    http.request(options, res => {
        let output = "";
        res.setEncoding("utf8");

        res.on("data", chunk => {
            output += chunk;
        });

        res.on("end", () => {
            onResult(JSON.parse(output));
        });
    })
        .on("error", error => {
            return error;
        })
        .end();
}

function pingAll(port) {
    var found = [];
    for (i = 0; i < 256; i++) {
        myIP = IP.address().split(".");
        pingIP = myIP[0] + "." + myIP[1] + "." + myIP[2] + "." + i;
        ping({ hostname: pingIP, port: port, path: "/", method: "GET" }, out => {
            found.push(pingIP);
        });
    }
}

module.exports.pingAll = pingAll;
