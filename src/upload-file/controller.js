const config = require('config');
const rootFolderFs = config.get('rootFolder');
const {upload, pathStat, getPath} = require('../_file-sys');

const uploadToServer = (file, location, options, metaData) => {
	
	location = getPath(location, rootFolderFs, options);
	// return Promise.resolve(location)
	return new Promise(async (resolve, reject) => {
		if (!file) return reject(new Error('file is required'));
		
		try {
			// const stat = await pathStat(location, options);
			// if (!stat.isDirectory()) return reject(new Error('location must be a directory'));
			
			const data = await upload(file, location, options, metaData);
			resolve(data)
			
		} catch (error) {
			reject(error)
		}
		
	})
};

module.exports = {
	uploadToServer: uploadToServer
};