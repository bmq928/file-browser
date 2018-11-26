const AWS = require('aws-sdk')
const credential = {
  accessKeyId: 'AKIAJEMDQITPC5HMUVEQ',
  secretAccessKey: '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'
}

const s3 = new AWS.S3(credential)

module.exports = {
  s3
}