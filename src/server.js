const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const app = express()

const fileExplore = require('./fileExplore')
const uploadFile = require('./uploadFile')
const downloadFile = require('./downloadFile')

// dependency
app.use(helmet())
app.use(cors())
// app.use(uploadFile.middleware())

//router
app.use('/file-explore', fileExplore.route)
app.use('/upload', uploadFile.route)
app.use('/download', downloadFile.route)

module.exports = app