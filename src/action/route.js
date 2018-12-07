const route = require('express').Router();
const controller = require('./controller');
const config = require('config');
const options = {
  s3: config.get('s3'),
  bucket: config.get('aws.bucket')
};

route.get('/copy', async (req, res) => {
  const { from, dest } = req.query;

  try {
    const data = await controller.itemCopy(from, dest, options);
    res.status(200).json({ data })
  } catch (error) {
    // console.log({error})
    res.status(400).json({ message: error.message })
  }
})

route.get('/remove', async (req, res) => {
  const filePath = req.query.file_path;

  try {
    const data = await controller.itemRemove(filePath, options);
    res.status(200).json({data});
  } catch (error) {
    console.log({error})
    res.status(400).json({ message: error.message })
  }

})

route.get('/move', async (req, res) => {
  const { from, dest } = req.query;

  try {
    const data = await controller.itemMove(from, dest, options);
    res.status(200).json({data});
  } catch(error) {
    res.status(400).json({message: error.message});
  }
})

module.exports = route;