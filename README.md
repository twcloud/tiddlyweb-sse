# tiddlyweb-sse

This plugin runs in both the browser and server to sync changes immediately instead of waiting for polling. It adds a route to the server which sends server-sent events to the client, and loads an `EventSource` in the client to call `$tw.syncer.syncFromServer()`. 
