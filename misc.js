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
            try {
                callback(JSON.parse(output), undefined);
            } catch (error) {
                callback(undefined, error);
            }
            
        });
    })
        .on("error", error => {
            callback(undefined, error);
        })
        .end();
}

function pingAll(port) {
    return new Promise((res, rej) => {
        var found = [];
        var done = 0;
        for (i = 0; i < 256; i++) {
            myIP = ip.address().split(".");
            pingIP = myIP[0] + "." + myIP[1] + "." + myIP[2] + "." + i;
            ping({ hostname: pingIP, port: port, path: "/", method: "GET" }, (out, err) => {
                done++;
                console.log(done);
                if (!err) found.push(pingIP);
                if (done >= 256) res(found);
            });
        }
    });
}

module.exports.pingAll = pingAll;
