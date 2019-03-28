const config = require('config');
const _ = require('lodash')

class FolderTree {
	constructor(
		rootName,
		displayName,
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
		this.displayName = displayName || rootName;
		
		//sync path s3 and fs
		if ((process.env.STORAGE_S3 || config.get('s3')) && path.length && path[0] !== '/') {
			this.path = '/' + path;
		}
	}
	
	addFile(fileName, displayName, path, files = [], folders = [], size = 0, modifiedDate = 0, metaData) {
		this.files.push(new FolderTree(fileName, displayName, true, path, files, folders, size, modifiedDate, metaData));
	}
	
	addFolder(folderName, displayName, path, files = [], folders = [], size = 0, modifiedDate = 0, metaData) {
		this.folders.push(new FolderTree(folderName, displayName, false, path, files, folders, size, modifiedDate, metaData));
	}
	
	containMetaData(content) {
		return exploreTree(content.conditions, this.metaData, function (obj, meta) {
			let key = Object.keys(obj)[0];
			// if (key === 'name') {
			// console.log(obj[key].toLowerCase(), meta[key].toLowerCase())
			if (key === 'uploaded' && meta[key]) {
				if (obj[key].from === obj[key].to) {
					return (obj[key].from < +meta[key]) && (+meta[key] < (obj[key].from + 86400000));
				} else if (obj[key].from < obj[key].to) {
					return (obj[key].from < +meta[key]) && (+meta[key] < (obj[key].to + 86400000));
				} else {
					return false;
				}
			} else {
				return meta[key] && ((meta[key].toLowerCase()).search(obj[key].toLowerCase().replace(/\?/g, ".?").replace(/\*/, ".*")) !== -1);
			}
			// } else {
			// 	return obj[key] === meta[key];
			// }
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
