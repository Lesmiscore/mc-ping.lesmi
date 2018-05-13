module.exports = {
    bedrock: {
        unconnectedPing: require("./bedrock/ucp"),
        fullStat: require("./bedrock/query")
    },
    javaEd: {
        query: require("./javaed/query")
    }
};
