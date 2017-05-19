"use strict";

const path = require("path")
, fs = require("fs")
, ctrl = require('./../controllers')
, mdlwr = require('./../middlewares')
, byString  = (o, s) => {
	s = s.replace(/\[(\w+)\]/g, '.$1'); 
	s = s.replace(/^\./, '');
	var a = s.split('.');
	for (var i = 0, n = a.length; i < n; ++i) {
		var k = a[i];
		if (k in o) {
			o = o[k];
		} else {
			return;
		}
	}
	return o;
};

module.exports = (app) => {
	fs
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
	}, [])
	.forEach( (routeGroup) =>  {
		var groupMiddlewares = ( Array.isArray(routeGroup.middlewares))?routeGroup.middlewares:[]
		, appliedGroupMdlwrs = [];

		groupMiddlewares.forEach( (middlewares) => {
			appliedGroupMdlwrs.push(byString(mdlwr, middlewares))
		})

		routeGroup.routes.forEach( (endpoints) => {
			var method = endpoints[0]
			, url = endpoints[1]
			, target = endpoints[2]
			, middlewares = ( Array.isArray(endpoints[3]))?endpoints[3]:[]
			, appliedMdlwrs = [];

			middlewares.forEach( (mdlwrs) => {
				appliedMdlwrs.push(byString(mdlwr, mdlwrs))
			})

			app[method](routeGroup.prefix+url, appliedGroupMdlwrs, appliedMdlwrs, byString(ctrl, target));
		})
	});
}