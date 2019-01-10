const config = require('config');
const _ = require('lodash')

class FolderTree {
	constructor(
		rootName,
		rootIsFile = false,
		path = '/',
		files = [],
		folders = [],
		size = 0,
		modifiedDate = Date.now(),
		metaData = '',
	) {
		
		
		this.rootIsFile = rootIsFile;
		this.rootName = rootName;
		this.files = files;
		this.folders = folders;
		this.path = path;
		this.size = size;
		this.modifiedDate = modifiedDate;
		this.metaData = metaData;
		
		//sync path s3 and fs
		if (config.get('s3') && path.length && path[0] !== '/') {
			this.path = '/' + path;
		}
	}
	
	addFile(fileName, path, files = [], folders = [], size = 0, modifiedDate = 0, metaData) {
		this.files.push(new FolderTree(fileName, true, path, files, folders, size, modifiedDate, metaData));
	}
	
	addFolder(folderName, path, files = [], folders = [], size = 0, modifiedDate = 0, metaData) {
		this.folders.push(new FolderTree(folderName, false, path, files, folders, size, modifiedDate, metaData));
	}

	containMetaData(content) {

		if(typeof this.metaData === 'string') 
			return this.metaData === content

		const metaDataVals = Object.values(this.metaData)
		return !!metaDataVals.filter(
			val => _.toLower(val).includes(_.toLower(content))
		).length
	}
}

module.exports = FolderTree;
