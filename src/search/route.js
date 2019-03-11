const route = require('express').Router();
const controller = require('./controller');
const config = require('config');
const checking = require('../_checking');
const bodyParser = require('body-parser');
const options = {
	s3: config.get('s3'),
	bucket: config.get('aws.bucket'),
	maxSizeText: config.get('maxSizeText')
};
route.use(bodyParser.json());
route.get('/', async (req, res) => {
	let {folder, content} = req.query;
	
	try {
		folder = await checking.validateUrl(folder, req.decoded);
		const data = await controller.search(folder, content, options);
		res.status(200).json({data});
	} catch (error) {
		res.status(400).json({message: error.message});
		
	}
});

route.post('/', async (req, res) => {
	let {folder, content} = req.body;
	console.log(folder);
	try {
		folder = await checking.validateUrl(folder, req.decoded);
		const data = await controller.search(folder, content, options);
		res.status(200).json({data});
	} catch (error) {
		res.status(400).json({message: error.message});
	}
});

module.exports = route;