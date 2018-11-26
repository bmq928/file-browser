const route = require('express').Router()
const { readdirRecursive, readdirShallow } = require('./controller')

route.get('/recursive', async (req, res) => {
  try {
    const { dir, s3, bucket } = req.query
    const options = { s3, bucket }
    const data = await readdirRecursive(dir, options)
    res.status(200).json({ data })
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: error.message })
  }
})

route.get('/shallow', async (req, res) => {
  try {
    const { dir, s3, bucket } = req.query
    const options = { s3, bucket }
    const data = await readdirShallow(dir, options)
    res.status(200).json({ data })
  } catch (error) {
    console.log(error)
    res.status(404).json({ message: error.message })
  }
})

module.exports = route
