const route = require('express').Router();
// const path = require('path');
const controller = require('./controller');
const config = require('config');
const bodyParser = require('body-parser');
route.use(bodyParser.json());
// const rootFolderFs = config.get('rootFolder');
const options = {
    s3: process.env.STORAGE_S3 || config.get('s3'),
    bucket: process.env.STORAGE_BUCKET || config.get('aws.bucket')
};

route.get('/', async (req, res) => {

    let filePath = req.query.file_path;
    // filePath = await checking.validateUrl(filePath, req.decoded);
    // if(!options.s3) filePath = path.join(rootFolderFs, filePath);

    try {

        await controller.download(filePath, options, res)

    } catch (error) {
        res.status(400).json({error: error.message})
    }


});

route.post('/', async (req, res) => {
    try {
        await controller.downloadMultiFiles(req.body, {
            ...options,
            dir: req.decoded.company + "/" + req.decoded.dir
        }, res)
    } catch (err) {
        res.status(400).json({error: err.message});
    }
});

module.exports = route;
