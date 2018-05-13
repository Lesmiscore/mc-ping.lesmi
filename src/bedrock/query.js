const dgram = require("dgram");
const request = require("./query-request");
const util = require("../utils/util");
const parser = require("./query-parser");

// this value is constant; specified in protocol
const sessionId = 1;
const States = {
    HANDSHAKE: "handshake",
    WAITING: "waiting"
};

const dbg = () => { };

const idHandshake = 9;
const idStat = 0;

function sendQuery(host, port) {
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket("udp4");
        let state = States.HANDSHAKE;
        let token = null;
        let ok = false;
        dbg("socket ready");

        function send(message) {
            dbg("data " + message.toString("hex"));
            client.send(message, 0, message.length, port, host, (err, bytes) => {
                dbg(`sent ${err} ${bytes}`);
                if (err) {
                    reject(err);
                    client.close();
                }
            });
        }

        client.on("message", (msg, rinfo) => {
            dbg("received: " + state + " " + msg.toString("hex"));
            switch (state) {
                case States.HANDSHAKE: {
                    // when we received handshake result;
                    // get token from message
                    const message = msg.toString("hex");
                    if (message.substring(0, 10).toLowerCase() != "0900000001") {
                        reject("illegal handshake: " + message.substring(0, 10));
                        client.close();
                        return;
                    }
                    token = parseInt(util.hexToString(message.substring(10, message.length - 2)));
                    state = States.WAITING;
                    dbg("token " + token);
                    fullStat();
                    break;
                }
                case States.WAITING: {
                    // when we received the content
                    resolve(parser(msg));
                    ok = true;
                    client.close();
                    break;
                }
            }
        });

        client.on("err", (err) => {
            dbg("error triggered");
            reject(err);
            client.close();
        });

        client.on("close", () => {
            dbg("closed");
            if (!ok) {
                reject("No result");
            }
        });

        function fullStat() {
            dbg("full stat");
            const fullStatBuffer = new request.QueryRequest(idStat)
                .setSessionId(sessionId)
                .setPayload(Buffer.from(util.int32ToHex(token) + "00000000", "hex"))
                .toBuffer();
            send(fullStatBuffer);
        }

        dbg("sending handshake");
        const handshakeBuffer = new request.QueryRequest(idHandshake)
            .setSessionId(sessionId)
            .toHex();
        const padded = Buffer.from(handshakeBuffer + "00000000", "hex");
        send(padded);
    });
}

module.exports = sendQuery;
