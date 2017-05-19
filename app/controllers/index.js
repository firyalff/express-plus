"use strict";

const fs      = require("fs")
, path    = require("path");

var ctrl	= {};

fs
.readdirSync(__dirname)
.filter((file) => {

	if (fs.lstatSync(__dirname+'/'+file).isDirectory())
	{
		var innerCtrl = {};

		fs
		.readdirSync(__dirname+'/'+file)
		.filter((innerfile) => {
			return (innerfile.indexOf(".") !== 0) && (fs.lstatSync(__dirname+'/'+file+'/'+innerfile).isFile());
		})
		.forEach((innerfile) => {
			innerCtrl[innerfile.split(".")[0]] =  require(path.join(__dirname, file, innerfile));
		});

		ctrl[file] = innerCtrl;
	}

	return (file.indexOf(".") !== 0) && (fs.lstatSync(__dirname+'/'+file).isFile()) && (file !== "index.js");
})
.forEach((file) => {
	ctrl[file.split(".")[0]] = require(path.join(__dirname, file));
});

module.exports = ctrl;
