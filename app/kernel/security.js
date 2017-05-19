'use strict';

module.exports = (app) => {
	const secConfig = require('../configs/'+((process.env.NODE_ENV==='local-dev')?'local-dev/':'')+'security')[process.env.NODE_ENV]
	, lusca = require('lusca');

	app.use(lusca(secConfig));
	app.disable('x-powered-by');

}