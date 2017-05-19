'use strict';
const aws = require('aws-sdk'),
multer = require('multer'),
multerS3 = require('multer-s3');

aws.config = require('../configs/'+((process.env.NODE_ENV==='local-dev')?'local-dev/':'')+'awsS3')[process.env.NODE_ENV];

const s3 = new aws.S3(),
shortid = require('shortid');


const reverse = function(s) {
		return s.split("").reverse().join("");
	};

const methods = {
	getFilename(file) {
		var originalname = file.originalname;
		var extension = originalname.split(".");
		return shortid.generate()+reverse(Date.now().toString()) + '.' + extension[extension.length-1];
	},
	base64Generate(string) {
		return new Buffer(String(string)).toString('base64');
	},
	objectNamer(type, attributes, options) {
		var loc = '';
		switch (type) {
			case 'product':
			var today = new Date();
			loc = 'product/'+(parseInt(today.getMonth())+1).toString()+'-'+today.getFullYear().toString();
			break;

			case 'profile':
			loc = 'cust/'+reverse(this.base64Generate(attributes.id+attributes.name))+'/profile';
			break;
			
			case 'fjb-buy':
			loc = 'cust/'+reverse(this.base64Generate(attributes.id+attributes.name))+'/buy';
			break;
			
			case 'fjb-sell':
			loc = 'cust/'+reverse(this.base64Generate(attributes.id+attributes.name))+'/sell';
			break;
			
			case 'farmer-ktp':
			loc = 'farm/'+reverse(this.base64Generate(attributes.id+attributes.name))+'/ktp';
			break;
			
			case 'farmer-profile':
			loc = 'farm/'+reverse(this.base64Generate(attributes.id+attributes.name))+options.subdir[options.fieldname];
			break;

			case 'farmer-bank':
			loc = 'farm/'+reverse(this.base64Generate(attributes.id+attributes.name))+'/bank';
			break;

			case 'farmer-report':
			loc = 'farm/'+reverse(this.base64Generate(attributes.id+attributes.name))+'/report/'+attributes.id_activity;
			break;

			case 'agent-profile':
			loc = 'agt/'+reverse(this.base64Generate(attributes.id+attributes.name))+'/profile';
			break;

			default:
			loc = 'other';
		}

		return loc;
	},
	upload(mimetypes, file_fields, options) {
		const max_size = (typeof options != 'undefined' && (options.maxSize != null || typeof options.maxSize != 'undefined'))?options.maxSize:3000000;

		var uploader = multer({
			limits : { fileSize: max_size },
			storage : multerS3({
				s3: s3,
				bucket: aws.config.bucket,
				key: function (req, file, cb) {
					options.fieldname = file.fieldname;
					var location = methods.objectNamer(options.type, options.attributes, options);
					var filename =  methods.getFilename(file);

					req.uploadedFileName = aws.config.cloudfront+aws.config.bucket+'/'+location+'/'+filename;

					cb(null, location+'/'+filename);
				}
			}),
		}).fields(file_fields);
		return uploader;
	},
	deleteFiles(arrFileUrl, cb) {
		var delObjects = [],
		cloudfront = aws.config.cloudfront,
		rootLocation = cloudfront+aws.config.bucket+'/',
		otherRootLoc = cloudfront.replace('http://','https://'+aws.config.bucket+'.');

		if (arrFileUrl.length>0) {
			for (var i in arrFileUrl) {
				var fileLocation = arrFileUrl[i].replace(rootLocation, '')
					.replace(otherRootLoc,'');
				fileLocation = decodeURIComponent(fileLocation);
				delObjects.push({ Key: fileLocation });
			}

			s3.deleteObjects({
				Bucket: aws.config.bucket,
				Delete: {
					Objects: delObjects
				}
			}, cb );
		} else {
			cb;
		}
	},
	findFile(fileUrl, cb) {
		var rootLocation = aws.config.cloudfront+aws.config.bucket+'/',
		keyName = fileUrl.replace(rootLocation, '');
		s3.getObject(
		{ 
			Bucket: aws.config.bucket, 
			Key: keyName 
		}, 
		cb
		);
	},
}

module.exports = methods;
