const express = require('express')
const app = express()

const fileExplore = require('./fileExplore')


app.use('/file-explore', fileExplore.route)

module.exports = app