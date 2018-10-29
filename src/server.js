const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const app = express()

const fileExplore = require('./fileExplore')

// dependency
app.use(helmet())
app.use(cors())

//router
app.use('/file-explore', fileExplore.route)

module.exports = app