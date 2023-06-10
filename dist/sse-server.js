/*\
title: $:/plugins/twcloud/tiddlyweb-sse/sse-server.js
type: application/javascript
module-type: route

GET /events/plugins/twcloud/tiddlyweb/(channel)

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

var wikis = [];

// Import the Journal class
var Journal = require("$:/core/modules/server/server-sent-events.js").Journal;

/*
Setup up the array for this wiki and add the change listener
*/
function setupWiki(wiki) {
	function filter(conn) {
		return conn.state.wiki === wiki;
	}
	// Listen to change events for this wiki
	wiki.addEventListener("change",function(changes) {
		var jsonChanges = JSON.stringify(changes);
		eventServer.emitEvent("wiki-change","change",jsonChanges,filter);
	});
	wikis.push(wiki);
}

/*
Setup this particular wiki if we haven't seen it before
*/
function ensureChannelSetup(channel,wiki) {
	// setup wikis for the wiki-change channel
	if(channel === "wiki-change" && wikis.indexOf(wiki) === -1) { setupWiki(wiki); }
}
/** @type {import('../server-sent-events').Journal} */
var eventServer = new Journal();

// this filter is called for the emitter route, which recieves 
// messages from clients and forwards them to all listeners. It 
// does not affect messages sent directly by the server. 
// We don't use it in tiddlyweb so just set it to false
eventServer.emitterFilter = function(sender) {
	// do not allow clients to broadcast
	// they can't anyway unless a route is specified
	return function() { return false; };
}

if(!$tw.wiki.getTiddler("$:/plugins/tiddlywiki/tiddlyweb")) {
	$tw.utils.warning("Warning: Plugin \"twcloud/tiddlyweb-sse\" specified but \"tiddlywiki/tiddlyweb\" is missing");
}

// Export the route definition for this server sent events handler. 
// We don't need an emitter route, otherwise we could put the common 
// instance in a library tiddler export and require it in both files.

module.exports = eventServer.handlerExports(
	"plugins/twcloud/tiddlyweb-sse",
	function(request,response,state) {
		if(state.params[0] !== "wiki-change") {
			response.writeHead(404);
			response.end();
			return;
		}
		// remove the socket timeout
		request.setTimeout(0);
		ensureChannelSetup(state.params[0],state.wiki);
		eventServer.handler(request,response,state);
	}
);
})();