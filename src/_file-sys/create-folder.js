const fs = require('fs');
const {s3} = require('../_aws');
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

const withS3 = (bucket, name, dest, myMetaData) => {
	let metaData = {...myMetaData};
	const folder = path.join(dest, name) + '/'; //to make this it a folder
	metaData.encodingtype = "base64";
	for (let key in metaData) {
		if (key !== "encodingtype") {
			metaData[key] = (new Buffer(metaData[key], "utf8")).toString("base64");
		}
	}
	return new Promise((resolve, reject) => {
		const params = {
			Key: folder,
			Bucket: bucket,
			Metadata: metaData
		};
		
		s3.putObject(params, (err, data) => {
			if (err) return reject(err);
			
			resolve('done');
		})
	})
}

module.exports = (name, dest, options, metaData) => {
	if (options && options.s3) {
		return withS3(options.bucket, name, dest, metaData);
	}
	
	return withFs(name, dest);
}