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
		return exploreTree(content.conditions, this.metaData, function (obj, meta) {
			let key = Object.keys(obj)[0];
			if (key === 'name') {
				// console.log(obj[key].toLowerCase(), meta[key].toLowerCase())
				return (meta[key].toLowerCase()).includes(obj[key].toLowerCase());
			} else {
				return obj[key] === meta[key];
			}
		});
	}
}

function exploreTree(tree, metadata, compareFunc) {
	if (tree.children && tree.children.length) {
		if (tree.operator === "and") {
			return !tree.children.some(c => !exploreTree(c, metadata, compareFunc))
		} else {
			return tree.children.some(c => exploreTree(c, metadata, compareFunc))
		}
	} else {
		return compareFunc(tree, metadata);
	}
}

module.exports = FolderTree;
