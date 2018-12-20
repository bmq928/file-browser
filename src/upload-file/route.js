const route = require('express').Router();
const multer = require('multer');
const controller = require('./controller');
const config = require('config');
// const path = require('path')
// const rootFolderFs = config.get('rootFolder');
const options = {
	s3: config.get('s3'),
	bucket: config.get('aws.bucket')
};
const checking = require('../_checking');
route.use(multer().single('upload-file'));
route.post('/', async (req, res) => {
	const file = req.file;
	let location = req.query.location;
	let metaData = req.query.metaData ? JSON.parse(req.query.metaData) : {};
	// location = req.decoded.company + '/' + req.decoded.dir + location;
	location = await checking.validateUrl(location, req.decoded);
	// if(!options.s3) location = path.join(rootFolderFs, location)
	
	
	try {
		const data = await controller.uploadToServer(file, location, options, metaData);
		res.status(200).json({data})
	} catch (error) {
		res.status(400).json({message: error.message})
	}
});

// route.post('/', middleware.any())

module.exports = route;