const route = require('express').Router();
const multer = require('multer');
const controller = require('./controller');
const config = require('config');
const options = {
  s3: config.get('s3'),
  bucket: config.get('aws.bucket')
};

route.use(multer().single('upload-file'));
route.post('/', async (req, res) => {
  const file = req.file;
  const { location } = req.query;

  try {
    const data = await controller.uploadToServer(file, location, options);
    res.status(200).json({ data })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
});

// route.post('/', middleware.any())

module.exports = route;