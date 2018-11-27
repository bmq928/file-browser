const route = require('express').Router();
const controller = require('./controller');
const config = require('config');
const options = {
  s3: config.get('s3'),
  bucket: config.get('aws.bucket')
};

route.get('/', async (req, res) => {

  const filePath = req.query.file_path;

  try {

    await controller.download(filePath, options, res)

  } catch (error) {
    res.status(400).json({ error: error.message })
  }


});

module.exports = route;
