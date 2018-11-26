const fs = require('fs')
const { s3 } = require('../_aws')

const withFs = dir => {
  return new Promise((resolve, reject) => {
    fs.lstat(dir, (err, stat) => {
      if (err) return reject(err)

      return resolve(stat)
    })
  })
}

const withS3 = (bucket, dir) => {
  return new Promise((resolve, reject) => {
    //default of s3 dont use / at start
    //but in fs system use /
    if (dir[0] === '/') dir = dir.substr(1)

    s3.listObjects({
      Bucket: bucket
    })
      .promise()
      .then(data => {
        const foundContent = data.Contents.filter(
          content => content.Key === dir || content.Key === dir + '/'
        )[0]


        if (!foundContent) throw new Error('Directory is not founded')

        // to sync with version that using fs
        // folder end with /
        // file doesnt end with /
        return resolve({
          isFile: () => {
            return foundContent.Key[foundContent.Key.length - 1] !== '/'
          },
          isDirectory: () => {
            return foundContent.Key[foundContent.Key.length - 1] === '/'
          }
        })
      })
      .catch(err => reject(err))
  })
}

module.exports = (dir, options) => {
  if (options && options.s3) {
    if(!options.bucket) return Promise.reject(new Error('Bucket is required'))

    return withS3(options.bucket, dir)
  }

  return withFs(dir)
}