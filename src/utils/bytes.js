const util = require("./util");

class ByteWriter {
    constructor(initial) {
        this.data = initial ? initial : "";
    }
    writeLong(value) {
        this.data += util.int64ToHex(value);
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
    writeVarInt(value) {
        while (true) {
            if ((value & 0xFFFFFF80) == 0) {
                this.writeByte(value);
                return;
            }
            this.writeByte(value & 0x7F | 0x80);
            value >>>= 7;
        }
    }
    toHex() {
        return this.data;
    }
    toBuffer() {
        return Buffer.from(this.data, "hex");
    }
}

module.exports = { ByteWriter };
