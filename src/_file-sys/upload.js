const {s3} = require('../_aws');
const path = require('path');
const fs = require('fs');
const mqttClient = require('../utils/mqtt');
// const Buffer = require('buffer')

const withFs = (file, location = '') => {
	return new Promise(async (resolve, reject) => {
		
		const filePath = path.join(location, file.originalname);
		fs.writeFile(filePath, file.buffer, err => {
			if (err) return reject(err);
			
			const data = {
				filePath,
				success: true
			};
			
			resolve(data)
		})
		
	})
};

const withS3 = (bucket, file, location = '', metaData) => {
	return new Promise(async (resolve, reject) => {
		
		try {
			
			location = location === '/' ? '' : location;
			
			const params = {
				Bucket: bucket,
				Key: path.join(location, file.originalname),
				// Key: location + '/' + file.originalname,
				Body: file.buffer,
				Metadata: metaData
			};
			
			// console.log({params});
			
			// const data = await s3.upload(params).promise();
			// options: partSize > 5Mb (5 * 1024 * 1024)
			s3.upload(params, {partSize: 5 * 1024 * 1024, queueSize: 2}, (err, data) => {
				if (!err) resolve(data);
			}).on('httpUploadProgress', event => {
				let topic = "/upload/project_storage/".concat(metaData.uploaded, metaData.name);
				console.log(`Uploaded ${event.loaded} out of ${event.total} || ${(event.loaded / event.total) * 100}`);
				mqttClient.publish(topic, JSON.stringify({
					loaded: event.loaded,
					total: event.total,
					progress: 100 * event.loaded / event.total
				}), {qos: 2});
			});
		} catch (error) {
			reject(error);
		}
	})
};

module.exports = (file, location, options, metaData) => {
	if (!location) location = '';
	
	if (options && options.s3) {
		if (!options.bucket) return Promise.reject(new Error('Bucket is required'));
		
		return withS3(options.bucket, file, location, metaData)
	}
	
	return withFs(file, location)
};