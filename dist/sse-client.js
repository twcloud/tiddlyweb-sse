/*\
title: $:/plugins/twcloud/tiddlyweb-sse/sse-client.js
type: application/javascript
module-type: startup

Miscellaneous startup logic for both the client and server.

\*/
(function() {

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";
var checks = [
	"$:/status/IsLoggedIn",
	"$:/status/UserName",
	"$:/status/IsAnonymous",
	"$:/status/IsReadOnly"
];
// Export name and synchronous status
exports.name = "tiddlyweb-sse-hook";
exports.after = ["startup"];
exports.platforms = ["browser"];
exports.synchronous = true;
exports.startup = function() {
	var source = null;
	if($tw.syncer.syncadaptor.name !== "tiddlyweb") {return;}
	$tw.wiki.addEventListener("change",function(changes) {
		if(checks.filter(e => changes[e]).length === 0) {return;}
		// check if we have a previous one and close it if we do
		if(source && source.readyState !== source.CLOSED) {source.close();}
		// Get the mount point in case a path prefix is used
		var host = $tw.syncer.syncadaptor.getHost();
		// Make sure it ends with a slash (it usually does)
		if(host[host.length - 1] !== "/") {host += "/";}
		// get the endpoint 
		var endpoint = host + "events/plugins/twcloud/tiddlyweb-sse/wiki-change";
		// set the syncer poll to one hour
		$tw.syncer.pollTimerInterval = 1000 * 60 * 60;
		// Setup the event listener
		source = exports.setupSSE(endpoint,$tw.syncer);
	});
}

function debounce(interval,callback) {
	var timeout = null;
	return function() {
		clearTimeout(timeout);
		timeout = setTimeout(callback,interval);
	};
}

exports.setupSSE = function setupSSE(endpoint,syncer,refresh) {
	if(window.EventSource) {
		var source = new EventSource(endpoint,{withCredentials: true});
		var debouncedSync = debounce(syncer.throttleInterval,syncer.syncFromServer.bind(syncer));
		source.addEventListener("change",debouncedSync);
		source.onerror = function() {
			// return if we're reconnecting because that's handled automatically
			if(source.readyState === source.CONNECTING) {return;}
			// wait for the errorRetryInterval
			setTimeout(function() {
				//call this function to set everything up again
				exports.setupSSE(endpoint,syncer,true);
			},syncer.errorRetryInterval);
		};
		source.onopen = function() {
			// only run this on first open, not on auto reconnect
			source.onopen = function() {};
			// once we've properly opened, disable polling
			syncer.wiki.addTiddler({title: syncer.titleSyncDisablePolling,text: "yes"});
			//sync from server manually here to make sure we stay up to date
			if(refresh) {syncer.syncFromServer();}
		}
		return source;
	} else {
		return null;
	}
}

})();