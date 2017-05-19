'use strict';

module.exports = (app) => {
	const secret = require('../configs/'+((process.env.NODE_ENV==='local-dev')?'local-dev/':'')+'app')[process.env.NODE_ENV].secret
	, bodyParser = require('body-parser')
	, cors = require('cors')

	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({	extended: false }));
	app.use(cors());

	if (process.env.NODE_ENV != 'production') {
		app.use((err, req, res, next) => {
			return res.status(err.status || 500).json({
				err : ( app.get('env') != 'production' ) ? err : null
			})

		});
	}



}
