'use strict';

const JWT = require('jsonwebtoken') 
, key = require('../configs/'+((process.env.NODE_ENV==='local-dev')?'local-dev/':'')+'app')[process.env.NODE_ENV].secret
, APIFormat  = require(__dirname+'/../helpers/APIFormat')
, methods = {		
	isLoggedIn( req, res, next ) {
	    var token = req.headers['x-access-token'];

		if (token) {
			JWT.verify(token, key, function(err, decoded) {      
				if (err || decoded.user_group !== 'admin') {
					if (err.name=='TokenExpiredError')
						return res.status(401).json( APIFormat.response('Token expired.') );

					return res.status(401).json( APIFormat.response('Invalid token.') );
				} 
				else {
					req.decoded = decoded;     
					next(); 
				}
			});
		} 
		else {
			return res.status(401).json( APIFormat.response('Auth required.') );
		}
	},
};

module.exports = methods;