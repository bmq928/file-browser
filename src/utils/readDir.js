const fs = require('fs')
const util = require('util')


//promisify the function
module.exports = util.promisify(fs.readdir)