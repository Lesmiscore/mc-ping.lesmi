# mc-ping.js
Minecraft Ping library in Node.js    
    
This library supports the following operations:    

- Unconnected Ping for Bedrock Ed. servers
- Full stat for Bedrock Ed. servers
- Query for Java Ed. servers

# Usage
All method returns Promise that resolve to result.

## Install

```
npm i mc-ping.lesmi
```

## Unconnected Ping

```javascript
require("mc-ping.lesmi").bedrock.unconnectedPing('localhost', 19132);
```

## Full stat

```javascript
require("mc-ping.lesmi").bedrock.fullStat('localhost', 19132);
```

## Query

```javascript
require("mc-ping.lesmi").javaEd.query('localhost', 25565);
```

