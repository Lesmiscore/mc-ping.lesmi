const net = require("net");
const util = require("../utils/util");
const bytes = require("../utils/bytes");

const packetHandshake = 0x00;
const packetStatusRequest = 0x00;
const protocolVersion = 4;
const statusHandshake = 1;

function handshake(host, port) {
    const contentWriter = new bytes.ByteWriter();
    const hostInBuffer = Buffer.from(host, "utf-8");
    contentWriter.writeByte(packetHandshake);
    contentWriter.writeVarInt(protocolVersion);
    contentWriter.writeVarInt(hostInBuffer.length);
    contentWriter.writeHex(hostInBuffer.toString("hex"));
    contentWriter.writeShort(port);
    contentWriter.writeVarInt(statusHandshake);

    const contentBuffer = contentWriter.toBuffer();
    const finalWriter = new bytes.ByteWriter();
    finalWriter.writeVarInt(contentBuffer.length);
    finalWriter.writeBuffer(contentBuffer);
    return finalWriter.toBuffer();
}

function request() {
    const writer = new bytes.ByteWriter();
    // size of packet
    writer.writeByte(0x01);
    writer.writeByte(packetStatusRequest);
    return writer.toBuffer();
}

function sendQuery(host, port) {
    return new Promise((resolve, reject) => {
        const stream = net.connect(port, host);
        const reader = new bytes.StreamReader(stream);
        let ok = false;
        stream.on("close", () => {
            if (!ok) {
                reject("No result");
            }
            stream.destroy();
        });
        stream.write(handshake(host, port));
        stream.write(request());
        stream.on("readable", () => {
            // skip size
            reader.readVarInt();
            const id = reader.readVarInt();
            if (id != packetStatusRequest) {
                reject("Server returned invalid packet");
                return;
            }
            const json = reader.readUtfVarInt();
            try {
                resolve(JSON.parse(json));
            } catch (e) {
                reject(e);
            }
            ok = true;
            stream.destroy();
        });
    });
}

module.exports = sendQuery;
