const route = require('express').Router();
const multer = require('multer');
// const controller = require('./controller');
const config = require('config');
const multerS3 = require('multer-s3');
const path = require('path');
const s3 = require('../_aws').s3;
const checking = require('../_checking');


const upload = multer({
	storage: multerS3({
		s3: s3,
		bucket: config.aws.bucket,
		metadata: function (req, file, cb) {
			cb(null, req.query.metaData ? JSON.parse(req.query.metaData) : {});
		},
		key: function (req, file, cb) {
			checking.validateUrl(req.query.location, req.decoded).then(location => {
				cb(null, path.join(location, file.originalname));
			});
		}
	})
});

// console.log(s3);
// const path = require('path')
// const rootFolderFs = config.get('rootFolder');
const options = {
	s3: config.get('s3'),
	bucket: config.get('aws.bucket')
};

//without streaming data to s3

// route.post('/old-method', async (req, res) => {
// 	const file = req.file;
// 	console.log(file);
// 	let location = req.query.location;
// 	let metaData = req.query.metaData ? JSON.parse(req.query.metaData) : {};
// 	// location = req.decoded.company + '/' + req.decoded.dir + location;
// 	location = await checking.validateUrl(location, req.decoded);
// 	// if(!options.s3) location = path.join(rootFolderFs, location)
//
//
// 	try {
// 		// const data = await controller.uploadToServer(file, location, options, metaData);
// 		controller.uploadToServer(file, location, options, metaData).then(data => {
// 			console.log(data);
// 		});
// 		res.status(200).json({topic: "/upload/project_storage/".concat(metaData.uploaded, metaData.name)});
// 	} catch (error) {
// 		res.status(400).json({message: error.message})
// 	}
// });


route.post('/', (req, res, next) => {
	next();
}, upload.single('upload-file'), (req, res) => {
	res.status(200).send(req.file);
});

route.get('/is-existed', (req, res) => {
	let objectLocation = JSON.parse(req.query.metaData).location;
	checking.validateUrl(objectLocation, req.decoded).then(key => {
		s3.headObject({
			Bucket: config.aws.bucket,
			Key: key
		}, (err, metadata) => {
			if (err && err.code === "NotFound") {
				res.status(200).json({mess: "Not Found"});
			} else {
				res.status(200).json({code: 409, metadata: metadata});
			}
		});
	});
});

module.exports = route;