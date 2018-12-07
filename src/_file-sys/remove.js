const fs = require('fs');
const {s3} = require('../_aws');

const withFs = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.unlink(filePath, err => {
      if(err) return reject(err);

      resolve('done')
    })
  })
}

const withS3 = (bucket, filePath) => {
  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      Key: filePath
    };
  
    s3.deleteObject(params, (err, data) => {
      if(err) return reject(err);

      resolve(data);
    });
  })
}



module.exports = (filePath, options) => {
  if(options && options.s3) {
    return withS3(options.bucket, filePath);
  }

  return withFs(filePath);
}