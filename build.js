var $tw = require("tiddlywiki").TiddlyWiki();
var path = require("path");
var fs = require("fs");

// Pass the command line arguments to the boot kernel
$tw.boot.argv = ["."];
// we only need the first phase of startup
$tw.boot.initStartup({});
// get the bundle output path
var output = path.resolve("output/plugin.info");
// create the directory tree
if(!fs.existsSync(path.dirname(output))) {
    fs.mkdirSync(path.dirname(output),{recursive: true});
}
// load the plugin from the dist folder
var plugin = $tw.loadPluginFolder(path.join(__dirname,"dist"));
// put the plugin tiddlers back into the tiddlers field
$tw.utils.extend(plugin,JSON.parse(plugin.text));
// remove the text field
delete plugin.text;
// write the bundled plugin to file
fs.writeFileSync(output,JSON.stringify(plugin,null,"\t"));
