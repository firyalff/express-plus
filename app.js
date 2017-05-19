"use strict";

if (process.env.NODE_ENV == 'production')
	console.log("\x1b[31m", "You are now in production mode, every transaction are considered as REAL trasaction!");
else if (process.env.NODE_ENV == 'development')
	console.log("\x1b[32m", "You are now in cloud dev, environment!");
else
	console.log("All changes you made only applies locally, Have fun!");

const app = require('express')();

require('./app/kernel/http')(app);
require('./app/kernel/validator')(app);
require('./app/kernel/security')(app);
require('./app/kernel/interceptor')(app);
require('./app/routes')(app);

module.exports = app;
