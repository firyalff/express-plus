"use strict";

const fs = require("fs")
, path = require("path");

//DO NOT CHANGE LINE BELOW
//DO NOT USE INDEX.JS AS FILE NAME UNDER FOLDER

module.exports = fs
.readdirSync(__dirname)
.map( (filename) => {
	if(filename !== "index.js") {
		return require(path.join(__dirname, filename));
	}
})
.reduce( (grouproutes, route) => {
	if (route != null) {
		return grouproutes.concat(route);
	} 
	else {
		return grouproutes;
	}
}, []);