var $tw = require("tiddlywiki").TiddlyWiki();
var path = require("path");
var fs = require("fs");

// Pass the command line arguments to the boot kernel
$tw.boot.argv = ["++dist","."];

// Boot the TW5 app
$tw.boot.boot();

var filename = path.resolve("output/plugin.info");
$tw.utils.createFileDirectories(filename);
var tiddler = JSON.parse($tw.wiki.getTiddlerAsJson("$:/plugins/twcloud/tiddlyweb-sse"));
var fields = $tw.utils.extend({}, tiddler, JSON.parse(tiddler.text));
delete fields.text;
fs.writeFileSync(filename, JSON.stringify(fields, null, "\t"));