const route = require('express').Router()
const { readdirRecursive, readdirShallow } = require('./controller')

route.get('/recursive', async (req, res) => {
  try {
    const { dir } = req.query
    const data = await readdirRecursive(dir)
    res.status(200).json({ data })
  } catch (error) {
    res.status(404).json({ message: `Directory doesn't exist ` })
  }
})

route.get('/shallow', async (req, res) => {
  try {
    const { dir } = req.query
    const data = await readdirShallow(dir)
    res.status(200).json({ data })
  } catch (error) {
    res.status(404).json({ message: `Directory doesn't exist ` })
  }
})

module.exports = route