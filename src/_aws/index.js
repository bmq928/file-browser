const AWS = require('aws-sdk');
const config = require('config');
const credential = {
  accessKeyId: config.aws.accessKeyId,
  secretAccessKey: config.aws.secretAccessKey
};

const s3 = new AWS.S3(credential);

module.exports = {
  s3
};