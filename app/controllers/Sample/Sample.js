"use strict";

const models  = require(__dirname+'/../../models')
, APIFormat  = require(__dirname+'/../../helpers/APIFormat')
, jwt = require('jsonwebtoken')
, key = require('./../../configs/'+((process.env.NODE_ENV==='local-dev')?'local-dev/':'')+'app')[process.env.NODE_ENV].secret
, methods = {

	index(req, res) {
		return res.status(200).json(APIFormat.response('Hell-o World', {success: true}));
	},
}

module.exports = methods;