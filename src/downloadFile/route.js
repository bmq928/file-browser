const route = require('express').Router()
const controller = require('./controller')

route.get('/', async (req, res) => {
  const filePath = req.query.file_path

  try {
    const file = controller.getFile(filePath)
    res.download(file)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

module.exports = route
