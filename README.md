# tiddlyweb-sse

This plugin runs in both the browser and server to sync changes immediately instead of waiting for polling. It adds a route to the server which sends server-sent events to the client, and loads an `EventSource` in the client to call `$tw.syncer.syncFromServer()`. 

The plugin may be quickly included in a wiki by adding `"++C:\path\to\tiddlyweb-sse\dist"` _before_ the data folder. 

```bash
node tiddlywiki.js "++C:\path\to\tiddlyweb-sse\dist" "C:\my\datafolder" --listen
```

It may also be included in the data folder by putting the _contents_ of the dist folder or the single `plugin.info` bundle (available from the releases page) in the folder `plugins/tiddlyweb-sse`. 

https://github.com/twcloud/tiddlyweb-sse/releases
