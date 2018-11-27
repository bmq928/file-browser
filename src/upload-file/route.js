const route = require('express').Router();
const multer = require('multer');
const controller = require('./controller');

route.use(multer().single('upload-file'));
route.post('/', async (req, res) => {
  const file = req.file;
  const { s3, bucket, location } = req.query;
  const options = { s3, bucket };

  try {
    const data = await controller.uploadToServer(file, location, options);
    res.status(200).json({ data })
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
});

// route.post('/', middleware.any())

module.exports = route;

const a = 2;

