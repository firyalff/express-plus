var environment = process.env.NODE_ENV||'development';

const nodemailer = require('nodemailer'),
mailConfig = require('../configs/'+((environment==='local-dev')?'local-dev/':'')+'email')[environment].credential

var	smtpTransport = nodemailer.createTransport("SMTP", mailConfig.gmail),
ejs = require('ejs'),
fs = require('fs'),
viewLocation = __dirname+'/../../resources/email/';

module.exports = {
	send(packet, options) {
		var sender = '';

		if (typeof options != 'undefined' && (options.from != null || typeof options.from != 'undefined')) 
			sender = options.from;

		var listPromiseMail = [];
		for (var i = packet.length - 1; i >= 0; i--) 
		{
			var promiseMail = (function( packetParam ){

				return new Promise((resolve, reject) => {
					fs.readFile(viewLocation+packetParam.template+'.ejs', 'utf8', 
						(error, template) => {
							if (error) {
								error.status = 500;
								reject(err);
							}
							resolve(template)
						}
						);
				})
				.then(function(template){

					var mailOptions = {
						from: (sender != '')?sender:mailConfig.alias,
						to: packetParam.to,
						subject: packetParam.subject,
						html: ejs.render(template, packetParam.data)
					};

					
					var promiseSend = new Promise((resolve, reject) => {
						smtpTransport.sendMail(mailOptions, function(error, response) {
							if (error) 
							{
								error.status = 400;
								reject(error)
							}
							resolve(response);
						});
					});

					return promiseSend;
				})
			})(packet[i]);

			listPromiseMail.push(promiseMail);
		}
		return Promise.all(listPromiseMail);
	}
}