const {copy, getPath, remove, createFolder, update} = require('../_file-sys');
const config = require('config');
const rootFolderFs = config.get('rootFolder');

const itemCopy = async (from, dest, options) => {
	if (!from) throw new Error('from is required');
	if (!dest) throw new Error('dest is required');
	
	from = getPath(from, rootFolderFs, options);
	dest = getPath(dest, rootFolderFs, options);
	
	const data = await copy(from, dest, options);
	return data;
};

const itemRemove = async (filePath, options) => {
	
	if (!filePath) throw new Error('filePath is required');
	
	filePath = getPath(filePath, rootFolderFs, options);
	
	const data = await remove(filePath, options);
	return data;
	
};

const itemMove = async (from, dest, options) => {
	await itemCopy(from, dest, options);
	await itemRemove(from, options);
	
	return 'done';
};

const folderCreate = async (name, dest, options, metaData) => {
	if (!name) throw new Error('name, is required');
	if (!dest) throw new Error('dest is required');
	
	dest = getPath(dest, rootFolderFs, options);
	const data = await createFolder(name, dest, options, metaData);
	
	return data;
};

const updateMetaData = async (key, options, metaData) => {
	const data = await update(key, metaData, options);
	return data;
};

module.exports = {
	itemCopy: itemCopy,
	itemRemove: itemRemove,
	itemMove: itemMove,
	folderCreate: folderCreate,
	updateMetaData: updateMetaData
};