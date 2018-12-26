const route = require('express').Router();
const controller = require('./controller');
const config = require('config');
const bodyParser = require('body-parser');
const options = {
	s3: config.get('s3'),
	bucket: config.get('aws.bucket')
};
const checking = require('../_checking');

route.get('/copy', async (req, res) => {
	let from = req.query.from;
	let dest = req.query.dest;
	from = await checking.validateUrl(from, req.decoded);
	dest = await checking.validateUrl(dest, req.decoded);
	try {
		const data = await controller.itemCopy(from, dest, options);
		res.status(200).json({data})
	} catch (error) {
		// console.log({error})
		res.status(400).json({message: error.message})
	}
});

route.get('/remove', async (req, res) => {
	let filePath = req.query.file_path;
	filePath = await checking.validateUrl(filePath, req.decoded);
	try {
		const data = await controller.itemRemove(filePath, options);
		res.status(200).json({data});
	} catch (error) {
		console.log({error});
		res.status(400).json({message: error.message})
	}
	
});

route.get('/move', async (req, res) => {
	let from = req.query.from;
	let dest = req.query.dest;
	from = await checking.validateUrl(from, req.decoded);
	dest = await checking.validateUrl(dest, req.decoded);
	try {
		const data = await controller.itemMove(from, dest, options);
		res.status(200).json({data});
	} catch (error) {
		res.status(400).json({message: error.message});
	}
});

route.get('/create-folder', async (req, res) => {
	// const {dest, name} = req.query;
	let dest = req.query.dest;
	let name = req.query.name;
	let metaData = req.query.metaData ? JSON.parse(req.query.metaData) : {};
	dest = await checking.validateUrl(dest, req.decoded);
	try {
		const data = await controller.folderCreate(name, dest, options, metaData);
		res.status(200).json({data});
	} catch (error) {
		res.status(400).json({message: error.message})
	}
});
route.use(bodyParser.json());
route.post('/update-meta-data', async (req, res) => {
	let dest = req.body.key;
	dest = await checking.validateUrl(dest, req.decoded);
	try {
		const data = await controller.updateMetaData(dest, options, req.body.metaData);
		res.status(200).json({data});
	} catch (error) {
		res.status(400).json({message: error.message})
	}
});

module.exports = route;