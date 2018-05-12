const util = require("./util");

class ByteWriter {
    constructor(initial) {
        this.data = initial ? initial : "";
    }
    writeInt(value) {
        this.data += util.int32ToHex(value);
    }
    writeByte(value) {
        this.data += util.int8ToHex(value);
    }
    writeBuffer(buf) {
        this.data += buf.toString('hex');
    }
    writeHex(hex) {
        this.data += hex;
    }
    toHex() {
        return this.data;
    }
    toBuffer() {
        return Buffer.from(this.data, "hex");
    }
}

module.exports = { ByteWriter };
