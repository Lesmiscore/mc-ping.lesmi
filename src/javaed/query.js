const socket = require("socket");
const util = require("../utils/util");

const packetHandshake = 0x00;
const packetStatusRequest = 0x00;
const protocolVersion = 4;
const statusHandshake = 1;

function sendQuery(host, port) {
    return new Promise((resolve, reject) => {
    });
}

module.exports = sendQuery;
