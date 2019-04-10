const path = require('path');
const {s3} = require('../_aws');
const withS3 = (options, key, metaData) => {
	return new Promise(async (resolve, reject) => {
		let isFolder = key.lastIndexOf('/') === key.length - 1;
		let oldName = isFolder ? key.substring(key.lastIndexOf("/", key.length - 2) + 1, key.length - 1) : key.substring(key.lastIndexOf("/") + 1, key.length);
		if (oldName !== metaData.name) {
			if (isFolder) {
				console.log("Rename Folder : ", oldName, metaData.name);
				let newKey = key.substring(0, key.lastIndexOf("/", key.length - 2) + 1) + metaData.name + '/';
				// console.log(newKey);
				try {
					const allContents = await s3.listObjects({
						Prefix: key.substring(1, key.length),
						Bucket: options.bucket
					}).promise();
					const allDonePromise = allContents.Contents.map(content => new Promise(async (resolve, reject) => {
						const parmas = {
							Bucket: options.bucket,
							CopySource: path.join(options.bucket, content.Key),
							Key: content.Key.replace(key.substring(1, key.length), newKey).substring(1)
						};
						try {
							const data = await s3.copyObject(parmas).promise();
							resolve(data);
						} catch (error) {
							reject(error);
						}
					}));
					
					await Promise.all(allDonePromise);
					resolve()
					
				} catch (error) {
					reject(error)
				}
			} else {
				console.log("Rename File : ", oldName, metaData.name);
				let newKey = key.substring(0, key.lastIndexOf("/") + 1) + metaData.name;
				const params = {
					Bucket: options.bucket,
					CopySource: path.join(options.bucket, key),
					Key: newKey.substring(1, newKey.length),
				};
				try {
					s3.copyObject(params).promise().then(async (data) => {
						await s3.deleteObject({
							Bucket: options.bucket,
							Key: key.substring(1, key.length)
						}).promise().catch(err => {
							console.log(err);
						});
						resolve(data);
					});
				} catch (error) {
					reject(error);
				}
			}
		} else {
			if (metaData.encodingtype === "base64") {
				for (let key in metaData) {
					if (key !== "encodingtype") {
						metaData[key] = (new Buffer(metaData[key], "utf8")).toString("base64");
					}
				}
			}
			const params = {
				Bucket: options.bucket,
				CopySource: path.join(options.bucket, key),
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
		}
	});
};

module.exports = (key, metaData, options) => {
	return withS3(options, key, metaData);
};