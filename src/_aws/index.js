const AWS = require('aws-sdk')
const credential = {
  accessKeyId: 'AKIAIITOONVU44G5CS2A',
  secretAccessKey: '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'
}

const s3 = new AWS.S3(credential)

module.exports = {
  s3
}