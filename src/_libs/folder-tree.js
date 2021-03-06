const config = require('config');
const _ = require('lodash');

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
		
		let self = this;
		this.rootIsFile = rootIsFile;
		this.rootName = rootName;
		this.files = files;
		this.folders = folders;
		this.path = path;
		this.size = size;
		this.modifiedDate = modifiedDate;
		this.metaData = metaData;
		// this.displayName = displayName || rootName;
		this.datatype = metaData ? metaData.datatype : "Unknown";
		if (metaData) {
			self.metaData.name = rootName;
		}
		
		//sync path s3 and fs
		if ((process.env.STORAGE_S3 || config.get('s3')) && path.length && path[0] !== '/') {
			this.path = '/' + path;
		}
	}
	
	addFile(fileName, path, files = [], folders = [], size = 0, modifiedDate = 0, metaData) {
		this.files.push(new FolderTree(fileName, true, path, files, folders, size, modifiedDate, metaData));
	}
	
	addFolder(folderName, path, files = [], folders = [], size = 0, modifiedDate = 0, metaData) {
		this.folders.push(new FolderTree(folderName, false, path, files, folders, size, modifiedDate, metaData));
	}
	
	containMetaData(content, name) {
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
			} else if (key === 'well' && meta[key]) {
				let rs = false;
				try {
					rs = meta[key] && ((JSON.parse(meta[key].toLowerCase()).name).search(obj[key].toLowerCase().replace(/\?/g, ".?").replace(/\*/, ".*")) !== -1);
				} catch (e) {
					rs = false;
				}
				return rs;
			} else if (key === 'datatype' && meta[key]) {
				return meta[key] && ((meta[key].toLowerCase()) === obj[key].toLowerCase().replace(/\?/g, ".?").replace(/\*/, ".*"));
			} else if (key === 'location') {
				return meta[key] && (meta[key].toLowerCase().trim() === obj[key].toLowerCase().trim());
			} else {
				return meta[key] && ((meta[key].toLowerCase()).search(obj[key].toLowerCase().replace(/\?/g, ".?").replace(/\*/, ".*")) !== -1);
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
