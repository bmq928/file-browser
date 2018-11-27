const { s3 } = require('../_aws');
const path = require('path');
const fs = require('fs');
// const Buffer = require('buffer')

const withFs = (file, location = '') => {
  return new Promise(async (resolve, reject) => {

    const filePath = path.join(location, file.originalname);
    fs.writeFile(filePath, file.buffer, err => {
      if (err) return reject(err);

      const data = {
        filePath,
        success: true
      };
      
      resolve(data)
    })

  })
};

const withS3 = (bucket, file, location = '') => {
  return new Promise(async (resolve, reject) => {

    try {

      const params = {
        Bucket: bucket,
        Key: path.join(location, file.originalname),
        Body: file.buffer
      };

      const data = await s3.upload(params).promise();

      resolve(data)

    } catch (error) {
      reject(error)
    }
  })
};

module.exports = (file, location, options) => {
  if (!location) location = '';

  if (options && options.s3) {
    if (!options.bucket) return Promise.reject(new Error('Bucket is required'));

    return withS3(options.bucket, file, location)
  }

  return withFs(file, location)
};