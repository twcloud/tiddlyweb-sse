# tiddlyweb-sse

This plugin runs in both the browser and server to sync changes immediately instead of waiting for polling. It adds a route to the server which sends server-sent events to the client, and loads an `EventSource` in the client to call `$tw.syncer.syncFromServer()`. 

The plugin may be quickly included in a wiki by adding `"++C:\path\to\tiddlyweb-sse\dist"` _before_ the data folder. 

```bash
node tiddlywiki.js "++C:\path\to\tiddlyweb-sse\dist" "C:\my\datafolder" --listen
```