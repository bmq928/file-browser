const fs = require('fs');
const path = require('path');
const pathStat = require('./path-stat');
const readdir = require('./read-dir')
const {ncp} = require('ncp');
const {s3} = require('../_aws');
const _ = require('lodash')

//copy file
const withFsFile = (from, dest) => {
	return new Promise((resolve, reject) => {
		fs
			.createReadStream(from)
			.pipe(fs.createWriteStream(dest))
			.on('finish', () => resolve('done'))
			.on('error', (error) => reject(error))
	});
}


//copy folder
const withFsFolder = (from, dest) => {
	return new Promise((resolve, reject) => {
		ncp(from, dest, {filter: ''}, (err) => {
			if (err) return reject(err);
			
			resolve('done');
		})
	})
}

const withFs = (from, dest) => {
	return new Promise(async (resolve, reject) => {
		try {
			const stat = await pathStat(from);
			if (stat.isFile()) return resolve(withFsFile(from, dest))
			
			resolve(withFsFolder(from, dest));
		} catch (error) {
			reject(error)
		}
	})
}

// withFs('/home/bui/Desktop/test/optimize-request.txt', '/home/bui/Desktop/test/inner/optimize-request.txt')

const withS3 = (bucket, from, dest) => {
	
	return new Promise(async (resolve, reject) => {
		// const params = {
		//   Bucket: bucket,
		//   CopySource: from,
		//   Key: dest
		// };
		
		try {
			const allContents = await s3.listObjects({Prefix: from, Bucket: bucket}).promise();
			const allDonePromise = allContents.Contents.map(content => new Promise(async (resolve, reject) => {
				const parmas = {
					Bucket: bucket,
					CopySource: path.join(bucket, content.Key),
					Key: content.Key.replace(from, dest)
				}
				
				try {
					const data = await s3.copyObject(parmas).promise();
					resolve(data);
				} catch (error) {
					reject(error);
				}
			}))
			
			await Promise.all(allDonePromise);
			resolve()
			
		} catch (error) {
			reject(error)
		}
		
		// s3.copyObject(params, (err, data) => {
		//   if (err) return reject(err);
		
		//   resolve(data);
		// })
		
	});
}

const avoidDuplicateCopySrc = (src, destItems) => {
	const extSrc = path.extname(src)
	const fileNameSrc = path.basename(src, extSrc)
	const prefixSrc = path.dirname(src)
	
	const COPY_NOTATION = '-COPY-'
	
	//search for items that are similar to the src
	// const genDuplicateName = (num) => `${fileNameSrc}${COPY_NOTATION}${num}`
	const regex = new RegExp(`^(${fileNameSrc})(${COPY_NOTATION})*`, 'g')
	const similarItems = destItems.filter(i => i.match(regex))
	const itemWithMaxIdx = _.maxBy(similarItems, val => val.length + val) //trick : compare by length before compare str
	
	// if (similarItems.length === 1) {
	// 	return path.join(prefixSrc, `${fileNameSrc}${COPY_NOTATION}1${extSrc}`)
	// }
	if (!itemWithMaxIdx) return src
	
	
	const idxMax = itemWithMaxIdx.substring(
		itemWithMaxIdx.lastIndexOf(COPY_NOTATION) + COPY_NOTATION.length,
		itemWithMaxIdx.lastIndexOf('.'))
	
	const idxNew = parseInt(idxMax) + 1 || 1
	
	return path.join(prefixSrc, `${fileNameSrc}${COPY_NOTATION}${idxNew}${extSrc}`)
	
}

module.exports = async (from, dest, options) => {
	
	const fileName = path.basename(from);
	const itemsInDest = await readdir(dest, options)
	const newItemName = path.join(dest, fileName)
	const itemForCopy = avoidDuplicateCopySrc(newItemName, itemsInDest);
	
	if (options && options.s3) {
		
		return withS3(options.bucket, from, itemForCopy);
	}
	
	return withFs(from, itemForCopy);
};