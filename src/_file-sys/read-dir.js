const fs = require('fs');
const util = require('util');
const {s3} = require('../_aws');

//promisify the function
const withFs = util.promisify(fs.readdir);

async function listAllObjectsFromS3Bucket(params, data) {
	let isTruncated = true;
	let marker;
	while (isTruncated) {
		if (marker) params.Marker = marker;
		try {
			const response = await s3.listObjects(params).promise();
			response.Contents.forEach(item => {
				data.push(item);
			});
			isTruncated = response.IsTruncated;
			if (isTruncated) {
				marker = response.Contents.slice(-1)[0].Key;
			}
		} catch (error) {
			throw error;
		}
	}
}

const withS3 = (bucket, dir) => {
	return new Promise(async (resolve, reject) => {
		//default of s3 dont use / at start
		//but in fs system use /
		
		if (dir[0] === '/') dir = dir.substr(1);
		// and dir = / is a special case
		// therefore we muse have 2 case: dir = '' and rest
		
		
		try {
			const params = {Bucket: bucket, Prefix: dir, MaxKeys: 500};
			// const data = await s3.listObjects(params).promise();
			let data = [];
			await listAllObjectsFromS3Bucket(params, data);
			const items = data
				.map(i => {
					//remove prefix with curent diretory
					// e.g: dir=folder, i = folder/item/abc => curItem = item/abc
					let curItem = !dir ? i.Key.split(`${dir}/`)[0] : i.Key.split(`${dir}/`)[1];
					if (!curItem) curItem = "";
					// depth1Item = item
					const depth1Item = curItem.split('/')[0];
					return depth1Item
					
				})
				.filter((item, idx, arr) => item && arr.indexOf(item) === idx); //remove duplicate
			
			// const regex = !dir ? /.*/ : new RegExp(`^${dir}/.{1,}`, 'g');
			// const items = data.Contents
			//   .filter(i => !!i.Key.match(regex)) // matching pattern
			//   .map(i => {
			//     //remove prefix with curent diretory
			//     // e.g: dir=folder, i = folder/item/abc => curItem = item/abc
			//     const curItem = !dir ? i.Key.split(`${dir}/`)[0] : i.Key.split(`${dir}/`)[1];
			
			//     // depth1Item = item
			//     const depth1Item = curItem.split('/')[0];
			//     return depth1Item
			//   })
			//   .filter((item, idx, arr) => arr.indexOf(item) === idx); //remove duplicate
			
			resolve(items)
			
		} catch (error) {
			reject(error)
		}
		// s3.listObjects({ Bucket: bucket })
		//   .promise()
		//   .then(data => {
		
		//     const regex = new RegExp(`^${dir}/.{1,}`, 'g')
		//     const items = data.Contents
		//       .filter(i => !!i.Key.match(regex)) // matching pattern
		//       .map(i => {
		//         //remove prefix with curent diretory
		//         // e.g: dir=folder, i = folder/item/abc => curItem = item/abc
		//         const curItem = i.Key.split(`${dir}/`)[1]
		
		//         // depth1Item = item
		//         const depth1Item = curItem.split('/')[0]
		//         return depth1Item
		//       })
		//       .filter((item, idx, arr) => arr.indexOf(item) === idx) //remove duplicate
		
		//     resolve(items)
		//   })
		//   .catch(err => reject(err))
	})
};

// withS3('test-quang', '/').then(data => console.log(data))
// withFs('.').then(data => console.log(data))

module.exports = (dir, options) => {
	if (options && options.s3) {
		return withS3(options.bucket, dir)
	}
	
	return withFs(dir)
};
