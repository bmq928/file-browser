const route = require('express').Router()
const middleware = require('./middleware')

route.post('/', middleware.any())

module.exports = route