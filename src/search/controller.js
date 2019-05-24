const {readdirShallow} = require('../file-explorer').controller;
const _ = require('lodash');

const search = async (folder, content, options) => {
	if (!folder) throw new Error('folder is required');
	if (!content) throw new Error('content is required');
	
	const rootNode = await readdirShallow(folder, options);
	return await traverseTree(rootNode, content, options);
};

const traverseTree = async (rootNode, content, options) => {
	const {files, folders} = rootNode;
	let matchContent = [];
	
	for (const f of [...files, ...folders]) {
		
		
		const fname = _.toLower(f.rootName);
		/*
			search by object name
		 */
		const _nameSearch = content.name ? _.toLower(content.name) : null;
		/*
			search by metatData with operator
		 */
		if (f.containMetaData(content, fname) || fname.includes(_nameSearch)) {
			/*
				search by object type: file|folder|all
			 */
			if ((content.type === "file" && (f.rootIsFile)) || (content.type === "folder" && !f.rootIsFile) || (content.type === "all")) matchContent.push(f);
		}
	}
	
	const exploredFolders = await Promise.all(
		folders.map(f => readdirShallow(f.path, options))
	);
	
	const insideMatches = await Promise.all(
		exploredFolders.map(f => {
			/*
				excluded or included sub-folder
			 */
			if (content.subFolders !== 'excluded') {
				return traverseTree(f, content, options);
			} else {
				return [];
			}
		})
	);
	
	for (const insideMatch of insideMatches) {
		matchContent = [...matchContent, ...insideMatch]
	}
	
	return matchContent
};

module.exports = {
	search
};