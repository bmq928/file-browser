const fs = require('fs')
const util = require('util')

//promisify the function
const withFs = util.promisify(fs.readdir)

const withS3 = (bucket, dir) => {
  return new Promise((resolve, reject) => {
    
  })
}

module.exports = (dir, options) => {
  if(options && options.s3) {
    return withS3(options.bucket, dir)
  }

  return withFs(dir)
}