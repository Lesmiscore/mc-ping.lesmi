type FullStatData = {
    kv: string[],
    players: Map<string, string>
}

export = {
    bedrock: {
        unconnectedPing: (host: string, port: number) => <string[]>Promise,
        fullStat: (host: string, port: number) => <FullStatData>Promise
    },
    javaEd: {
        query: (host: string, port: number) => <any>Promise
    }
}