const multer = require('multer')
const path = require('path')
const config = require('config')

const rootProjPath = path.join(__dirname, '..', '..')
const uploadFoler = path.join(rootProjPath, config.get('uploadTo'))

const middleware =  multer({dest: uploadFoler})

module.exports = middleware