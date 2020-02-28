const ip = require("ip");
const http = require("http");

function ping(options, callback) {
    http.request(options, res => {
        let output = "";
        res.setEncoding("utf8");

        res.on("data", chunk => {
            output += chunk;
        });

        res.on("end", () => {
            callback(JSON.parse(output), undefined);
        });
    })
        .on("error", error => {
            onError(undefined, error);
        })
        .end();
}

function pingAll(port) {
    return new Promise((res, rej) => {
        var found = [];
        var done = 0;
        for (i = 0; i < 256; i++) {
            myIP = IP.address().split(".");
            pingIP = myIP[0] + "." + myIP[1] + "." + myIP[2] + "." + i;
            ping({ hostname: pingIP, port: port, path: "/", method: "GET" }, (out, err) => {
                done++;
                if (err == undefined) found.push(pingIP);
                if (done >= 256) res(found);
            });
        }
    });
}

module.exports.pingAll = pingAll;
