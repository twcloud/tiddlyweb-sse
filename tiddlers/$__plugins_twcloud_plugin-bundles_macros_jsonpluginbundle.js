/*\
title: $:/core/modules/macros/jsonpluginbundle.js
type: application/javascript
module-type: macro

Macro to output a plugin as a JSON bundle with tiddlers key parsed.

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

/*
Information about this macro
*/

exports.name = "jsonpluginbundle";

exports.params = [
	{name: "title"}
];

/*
Run the macro
*/
exports.run = function(title) {
	title = title || this.getVariable("currentTiddler");
	var tiddler = !!title && this.wiki.getTiddler(title),
		fields = new Object();
	if(tiddler) {
		for(var field in tiddler.fields) {
			fields[field] = tiddler.getFieldString(field);
		}
	}
    var text = JSON.parse(fields.text);
    $tw.utils.extend(fields, text);
	delete fields.text;
	return JSON.stringify(fields,null,$tw.config.preferences.jsonSpaces);
};

})();
