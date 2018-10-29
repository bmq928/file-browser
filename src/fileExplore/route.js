const route = require('express').Router()
const controller = require('./controller')

route.get('/', async (req, res) => {
  const data = await controller.folderExplore()

  res.status(200).json({data})
})

module.exports = route