const fs = require('fs')
const util = require('util')
const { s3 } = require('../_aws')

//promisify the function
const withFs = util.promisify(fs.readdir)

const withS3 = (bucket, dir) => {
  return new Promise(async (resolve, reject) => {
    //default of s3 dont use / at start
    //but in fs system use /
    if (dir[0] === '/') dir = dir.substr(1)
    try {
      
      const params = { Bucket: bucket }
      const data = await s3.listObjects(params).promise()

      const regex = new RegExp(`^${dir}/.{1,}`, 'g')
      const items = data.Contents
        .filter(i => !!i.Key.match(regex)) // matching pattern
        .map(i => {
          //remove prefix with curent diretory
          // e.g: dir=folder, i = folder/item/abc => curItem = item/abc
          const curItem = i.Key.split(`${dir}/`)[1]

          // depth1Item = item
          const depth1Item = curItem.split('/')[0]
          return depth1Item
        })
        .filter((item, idx, arr) => arr.indexOf(item) === idx) //remove duplicate

      resolve(items)

    } catch (error) {
      reject(error)
    }
    // s3.listObjects({ Bucket: bucket })
    //   .promise()
    //   .then(data => {

    //     const regex = new RegExp(`^${dir}/.{1,}`, 'g')
    //     const items = data.Contents
    //       .filter(i => !!i.Key.match(regex)) // matching pattern
    //       .map(i => {
    //         //remove prefix with curent diretory
    //         // e.g: dir=folder, i = folder/item/abc => curItem = item/abc
    //         const curItem = i.Key.split(`${dir}/`)[1]

    //         // depth1Item = item
    //         const depth1Item = curItem.split('/')[0]
    //         return depth1Item
    //       })
    //       .filter((item, idx, arr) => arr.indexOf(item) === idx) //remove duplicate

    //     resolve(items)
    //   })
    //   .catch(err => reject(err))
  })
}

// withS3('test-quang', 'folder').then(data => console.log(data))
// withFs('.').then(data => console.log(data))

module.exports = (dir, options) => {
  if (options && options.s3) {
    return withS3(options.bucket, dir)
  }

  return withFs(dir)
}
