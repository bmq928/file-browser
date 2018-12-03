const { s3 } = require('../_aws');
const fs = require('fs');
const pathStat = require('./path-stat');
const mime = require('mime');
const path = require('path');
const { Readable } = require('stream');
// const rootProjPath = path.join(__dirname, '..', '..')

const bufferToStream = buffer => {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);

  return stream
};

const bufferToBase64 = buffer => {
  return buffer.toString('base64');
}

const bufferToUtf8 = buffer => {
  return buffer.toString('utf8')
}

const withFs = filePath => {
  return new Promise(async (resolve, reject) => {
    try {
      const stat = await pathStat(filePath);

      if (stat.isDirectory()) throw new Error('This is directory');

      fs.readFile(filePath, (err, buffer) => {
        if(err) return reject(err);

        const data = {
          body: fs.createReadStream(filePath),
          contentType: mime.getType(filePath),
          name: path.basename(filePath),
          base64: bufferToBase64(buffer),
          buffer: buffer,
          utf8: bufferToUtf8(buffer)
        };

        resolve(data)
      })

    } catch (error) {
      reject(error)
    }
  })
};

const withS3 = (bucket, filePath) => {
  return new Promise(async (resolve, reject) => {
    try {
      const params = {
        Bucket: bucket,
        Key: filePath
      };
      const { Body, ContentType } = await s3.getObject(params).promise();
      const data = {
        name: path.basename(filePath),
        body: bufferToStream(Body),
        contentType: ContentType,
        buffer: Body,
        base64: bufferToBase64(Body),
        utf8: bufferToUtf8(Body)
      };

      resolve(data)
    } catch (error) {
      reject(error)
    }
  })
};

// const params = {
//   Bucket: 'test-quang',
//   Key: 'folder/inside/46310763_264816550750096_4002525313572536320_n.png'
// }
// s3.getObject(params).promise().then(data => console.log(data))

// withS3('test-quang', 'folder/inside/46310763_264816550750096_4002525313572536320_n.png')

module.exports = (filePath, options) => {
  if (options && options.s3) {
    if (!options.bucket) return Promise.reject(new Error('Bucket is required'));

    return withS3(options.bucket, filePath)
  }

  return withFs(filePath)
};
