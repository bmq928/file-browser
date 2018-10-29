const http = require('http')
const config = require('config')

const app = require('./server')
const PORT = config.get('PORT')

// const fileExplore = 

process.on('uncaughtException', err => console.error(err))
process.on('unhandledRejection', err => console.error(err))

http
  .createServer(app)
  .listen(PORT, () => console.log('App is started in port: ' + PORT))
