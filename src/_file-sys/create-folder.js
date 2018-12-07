const fs = require('fs');
const { s3 } = require('../_aws');
const path = require('path');

const withFs = (name, dest) => {

  const folder = path.join(dest, name);

  return new Promise((resolve, reject) => {
    fs.mkdir(folder, (err) => {
      if (err) return reject(err);

      resolve('done');
    })
  })
}

const withS3 = (bucket, name, dest) => {
  const folder = path.join(dest, name) + '/'; //to make this it a folder
  return new Promise((resolve, reject) => {
    const params = {
      Key: folder,
      Bucket: bucket
    };

    s3.putObject(params, (err, data) => {
      if(err) return reject(err);

      resolve('done');
    })
  })
}

module.exports = (name, dest, options) => {
  if(options && options.s3) {
    return withS3(options.bucket, name, dest);
  }

  return withFs(name, dest);
}