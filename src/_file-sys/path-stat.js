const fs = require('fs');
const {s3} = require('../_aws');

const withFs = dir => {
	return new Promise((resolve, reject) => {
		fs.lstat(dir, (err, stat) => {
			if (err) return reject(err);
			
			// return resolve(stat)
			
			return resolve({
				isDirectory: () => stat.isDirectory(),
				isFile: () => stat.isFile(),
				size: stat.size,
				LastModified: stat.mtime,
				metaData: ""
			})
		})
	})
};

const withS3 = (bucket, dir) => {
	return new Promise(async (resolve, reject) => {
		
		//special case
		if (dir === '' || dir === '/') return resolve({
			isDirectory: () => true,
			isFile: () => false
		});
		
		//default of s3 dont use / at start
		//but in fs system use /
		if (dir[0] === '/' || dir[0] === '//') dir = dir.substr(1);
		try {
			const params = {Bucket: bucket, Prefix: dir};
			const data = await s3.listObjects(params).promise();
			const foundContent = data.Contents.filter(
				content => content.Key === dir || content.Key === dir + '/'
			)[0];
			
			if (!foundContent) return reject(new Error('Directory is not founded'));
			// console.log("===", foundContent);
			// to sync with version that using fs
			// folder end with /
			// file doesnt end with /
			const metaData = (await s3.headObject({Bucket: bucket, Key: foundContent.Key}).promise()).Metadata;
			const stat = {
				isFile: () => {
					return foundContent.Key[foundContent.Key.length - 1] !== '/'
				},
				isDirectory: () => {
					return foundContent.Key[foundContent.Key.length - 1] === '/'
				},
				metaData: metaData,
				size: foundContent.Size,
				modifiedDate: foundContent.LastModified
			};
			
			// calculate size
			// because s3 treat folder as an empty object
			// therefore folder will have 0kb size
			
			return resolve(stat);
			
		} catch (error) {
			reject(error)
		}
	})
};

// withS3('test-quang', 'folder').then(data => console.log(data))

module.exports = (dir, options) => {
	if (options && options.s3) {
		if (!options.bucket) return Promise.reject(new Error('Bucket is required'));
		
		return withS3(options.bucket, dir)
	}
	
	return withFs(dir)
};
