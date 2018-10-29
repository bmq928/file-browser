const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const app = express()

const fileExplore = require('./fileExplore')
const uploadFile = require('./uploadFile')

// dependency
app.use(helmet())
app.use(cors())
// app.use(uploadFile.middleware())

//router
app.use('/file-explore', fileExplore.route)
app.use('/upload', uploadFile.route)

module.exports = app