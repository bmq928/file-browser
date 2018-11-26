const AWS = require('aws-sdk')
const credential = {
  accessKeyId: 'AKIAI5KUPQWUCXSAJAYA',
  secretAccessKey: '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'
}

const s3 = new AWS.S3(credential)

module.exports = {
  s3
}