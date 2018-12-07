const fs = require('fs');
const path = require('path');
const { s3 } = require('../_aws');

const withFs = (from, dest) => {
  return new Promise((resolve, reject) => {
    fs
      .createReadStream(from)
      .pipe(fs.createWriteStream(dest))
      .on('finish', () => resolve('done'))
      .on('error', (error) => reject(error))
  });
}

// withFs('/home/bui/Desktop/test/optimize-request.txt', '/home/bui/Desktop/test/inner/optimize-request.txt')

const withS3 = (bucket, from, dest) => {
  from = path.join(bucket, from)
  dest = path.join(bucket, dest)

  return new Promise((resolve, reject) => {
    const params = {
      Bucket: bucket,
      CopySource: from,
      Key: dest
    };

    s3.copyObject(params, (err, data) => {
      if(err) return reject(err);

      resolve(data);
    })

  });
}

module.exports = (from, dest, options) => {

  const fileName = path.basename(from);
  const destFile = path.join(dest, fileName);

  if (options && options.s3) {

    return withS3(options.bucket, from, destFile);
  }

  return withFs(from, destFile);
}