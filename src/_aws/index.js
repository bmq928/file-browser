const AWS = require('aws-sdk');
const config = require('config');
const credential = {
  accessKeyId: process.env.STORAGE_ACCESS_KEY || config.aws.accessKeyId,
  secretAccessKey: process.env.STORAGE_SECRET_KEY || config.aws.secretAccessKey
};

const s3 = new AWS.S3(credential);

module.exports = {
  s3
};