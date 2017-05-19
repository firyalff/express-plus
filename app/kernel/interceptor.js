'use strict';

module.exports = (app) => {

	const host = require('../configs/'+((process.env.NODE_ENV==='local-dev')?'local-dev/':'')+'app')[process.env.NODE_ENV].hostURL;

	app.use( (req, res, next) => {
		req.baseurl = req.protocol + '://' + host; //get base url
		
		return next();
	});
}
