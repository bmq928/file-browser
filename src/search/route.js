const route = require('express').Router()
const controller = require('./controller')
const config = require('config')
const options = {
  s3: config.get('s3'),
  bucket: config.get('aws.bucket'),
  maxSizeText: config.get('maxSizeText')
};

route.get('/', async (req, res) => {
  const { folder, content } = req.query

  try {
    const data = await controller.search(folder, content, options)
    res.status(200).json({data});    
  } catch (error) {
    res.status(400).json({message:error.message});
    
  }

})

module.exports = route