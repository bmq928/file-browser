const { s3 } = require('../_aws');
const rimraf = require('rimraf');
const { comparePathS3 } = require('../_checking');

// const withFs = (filePath) => {
//   return new Promise((resolve, reject) => {
//     fs.unlink(filePath, err => {
//       if(err) return reject(err);

//       resolve('done')
//     })
//   })
// }

const withFs = (itemPath) => {
  return new Promise((resolve, reject) => {
    rimraf(itemPath, err => {
      if (err) return reject(err);

      resolve('done');
    })
  })
}

const withS3 = (bucket, itemPath) => {
  return new Promise(async (resolve, reject) => {
    // const params = {
    //   Bucket: bucket,
    //   Key: filePath
    // };

    // s3.deleteObject(params, (err, data) => {
    //   if(err) return reject(err);

    //   resolve(data);
    // });

    const allContents = await s3.listObjects({ Prefix: itemPath, Bucket: bucket }).promise();
    const listRemoveKeys = allContents.Contents
      // filter content not right
      // e.x: /test and /test1
      // use api remove test => both test and test1 are removed
      .filter(c => comparePathS3(c.Key, itemPath))
      .map(c => ({ Key: c.Key }));
    const params = {
      Bucket: bucket,
      Delete: {
        Objects: listRemoveKeys
      }
    }

    s3.deleteObjects(params, (err, data) => {
      if (err) return reject(err);

      resolve(data);
    })
  })
}



module.exports = (itemPath, options) => {
  if (options && options.s3) {
    return withS3(options.bucket, itemPath);
  }

  return withFs(itemPath);
}