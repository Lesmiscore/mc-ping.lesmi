const util = require("../utils/util");

// https://github.com/Nukkit/Nukkit/blob/master/src/main/java/cn/nukkit/event/server/QueryRegenerateEvent.java
// "splitnum" 00 80 00
const bodyPadding = "73706c69746e756d008000";
// 01 "player_" 00 00
const middlePadding = "01706c617965725f0000";

function splitAtNullByte(hex) {
    const split = ":" + util.eachCharsFromString(hex, 2).join(":");
    return split.split(":00")
        .map(str => str.split(":").join(""));
}

function parseQuery(buf) {
    const hex = (buf.toString("hex") + "").toLowerCase();
    const [kvData, playerData] = hex.split(bodyPadding)[1].split(middlePadding)
        .map(str => str.substring(0, str.length - 4))
        .map(splitAtNullByte);
    const kv = [];
    let flagKeySet = false;
    let keyTmp = null;
    for (let key in kvData) {
        let value = util.hexToString(kvData[key]);
        if (flagKeySet) {
            kv[keyTmp] = value;
        } else {
            keyTmp = value;
        }
        flagKeySet = !flagKeySet;
    }

    const players = playerData.map(util.hexToString);

    return { kv, players };
}

module.exports = parseQuery;
