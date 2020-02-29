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
                callback([JSON.parse(output), options.hostname], undefined);
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

function pingAll(port, bar) {
    return new Promise((res, rej) => {
        var found = [];
        var done = 0;
        for (i = 0; i < 256; i++) {
            myIP = ip.address().split(".");
            pingIP = myIP[0] + "." + myIP[1] + "." + myIP[2] + "." + i;
            ping({ hostname: pingIP, port: port, path: "/ping", method: "GET" }, (out, err) => {
                done++;
                if (bar) bar.update(done);
                if (!err) if (out[0].online) found.push([out[1], out[0].name]);
                if (done >= 256) res(found);
            });
        }
    });
}

function sendMessage(msg, members, port, name) {
    for (let m of members) {
        const req = http.request(
            {
                hostname: m[0],
                port: port,
                path: "/msgIn",
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            },
            res => {}
        );
        req.on("error", error => console.error(error));
        req.write(JSON.stringify({ msg: msg, name: name }));
        req.end();
    }
}

module.exports.pingAll = pingAll;
module.exports.sendMessage = sendMessage;
