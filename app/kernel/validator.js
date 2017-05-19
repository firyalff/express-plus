'use strict';

module.exports = (app) => {
	const expressValidator = require('express-validator')
	, customValidators = {};

	app.use(expressValidator({
		customValidators: customValidators
	}));
}