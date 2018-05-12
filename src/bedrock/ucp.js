const dgram = require("dgram");
const util = require("../utils/util");
const bytes = require("../utils/bytes");

const ucpIdHex = "01";
const magicHex = "00ffff00fefefefefdfdfdfd12345678";

function sendUcp(host, port) {
    return new Promise((resolve, reject) => {
        const client = dgram.createSocket("udp4");
        function send(message) {
            client.send(message, 0, message.length, port, host, (err, bytes) => {
                if (err) {
                    reject(err);
                    client.close();
                }
            });
        }

        client.on("message", (msg, rinfo) => {
            const hex = msg.toString("hex");
            if (!hex.startsWith("1c")) {
                reject("Server replied with invalid data: " + hex);
                client.close();
                return;
            }
            const byteLength = parseInt(hex.substr(66, 4), 16);
            const data = hex.substr(70, byteLength * 2);
            resolve(util.hexToString(data).split(";"));
        });

        client.on("err", (err) => {
            reject(err);
            client.close();
        });

        client.on("close", () => { });

        const writer = new bytes.ByteWriter();
        writer.writeHex(ucpIdHex);
        writer.writeLong(Date.now());
        writer.writeHex(magicHex);
        send(writer.toBuffer());
    });
}

module.exports = sendUcp;
