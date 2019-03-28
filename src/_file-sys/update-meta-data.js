const path = require('path');
const {s3} = require('../_aws');
const withS3 = (bucket, key, metaData) => {
	return new Promise(async (resolve, reject) => {
		for (let key in metaData) {
			console.log(metaData[key]);
			metaData[key] = (new Buffer(metaData[key], "utf8")).toString("base64");
			console.log(metaData[key]);
		}
		const params = {
			Bucket: bucket,
			CopySource: path.join(bucket, key),
			Key: key.substring(1, key.length),
			Metadata: metaData,
			MetadataDirective: 'REPLACE'
		};
		try {
			const data = await s3.copyObject(params).promise();
			resolve(data);
		} catch (error) {
			reject(error);
		}
	});
};

module.exports = (key, metaData, options) => {
	return withS3(options.bucket, key, metaData);
};