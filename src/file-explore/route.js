const route = require('express').Router();
const { readdirRecursive, readdirShallow } = require('./controller');
const config = require('config');
const options = {
  s3: config.get('s3'),
  bucket: config.get('aws.bucket')
};

route.get('/recursive', async (req, res) => {
  try {
    const { dir } = req.query;
    const data = await readdirRecursive(dir, options);
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message })
  }
});

route.get('/shallow', async (req, res) => {
  try {
    const { dir } = req.query;
    const data = await readdirShallow(dir, options);
    res.status(200).json({ data })
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message })
  }
});

module.exports = route;
