const route = require('express').Router();
const controller = require('./controller');
const fs = require('fs');

route.get('/', async (req, res) => {

  const filePath = req.query.file_path;
  const options = {
    s3: req.query.s3,
    bucket: req.query.bucket
  };

  try {

    await controller.download(filePath, options, res)

  } catch (error) {
    res.status(400).json({ error: error.message })
  }


});

module.exports = route;
