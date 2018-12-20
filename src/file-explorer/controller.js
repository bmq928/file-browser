// const { readDir, pathStat, FolderTree } = require('../utils')
const { pathStat, readDir, getPath } = require('../_file-sys');
const { FolderTree } = require('../_libs');
const path = require('path');
const config = require('config');
const rootFolderFs = config.get('rootFolder');

//should try catch when use this function
//because it doesnt handle exception`
const _readdirRecursive = async (dir, options) => {

  if (!dir) throw new Error('dir is required');
  const briefDir = options.s3 ? dir : dir.replace(rootFolderFs, '') // parameter dir

  const curDirectoryStat = await pathStat(dir, options);
  const tree = new FolderTree(path.basename(dir), false, briefDir);

  if (curDirectoryStat.isFile()) {

    // tree.addFile(dir, true, briefDir);
    tree.rootIsFile = true
  } else if (curDirectoryStat.isDirectory()) {
    const items = await readDir(dir, options);

    //recursive
    //readir in every item in folder
    const subTrees = await Promise.all(
      items.map(item => _readdirRecursive(path.join(dir, item), options))
    );

    //push to tree
    for (const subTree of subTrees) {
      const itemName = subTree.rootName;
      const itemPath = path.join(briefDir, itemName);
      const childFiles = subTree.files;
      const childFolders = subTree.folders;

      if (subTree.rootIsFile) tree.addFile(itemName, itemPath, childFiles, childFolders);
      else tree.addFolder(itemName, itemPath, childFiles, childFolders);
    }
  }

  return tree;
};

const readdirRecursive = (dir, options) => {

  dir = getPath(dir, rootFolderFs, options);
  return _readdirRecursive(dir, options)
}

// readdirRecursive('folder', {s3:true, bucket: 'test-quang'})

//unhandle case dir is not exist
//try catch
const readdirShallow = async (dir, options) => {

  if (!dir) throw new Error('dir is required');

  dir = getPath(dir, rootFolderFs, options);
  const curDirectoryStat = await pathStat(dir, options);
  const rootName = path.basename(dir);
  const briefDir = options.s3 ? dir : dir.replace(rootFolderFs, '') // parameter dir
  // dir = options.s3 ? dir : path.join(rootFolderFs, dir) //actual dir for calculation


  //file
  if (curDirectoryStat.isFile()) {
    return new FolderTree(rootName);
  }

  //folder
  const items = await readDir(dir, options);
  const tree = new FolderTree(rootName, false, briefDir);
  const stats = await Promise.all(
    items.map(i => pathStat(path.join(dir, i), options))
  );

  for (const i in stats) {
    const stat = stats[i];
    const addedItem = items[i];
    const itemPath = path.join(briefDir, addedItem);
    const size = stat.size;
    const modifiedDate = stat.modifiedDate;
    const metaData = stat.metaData;
    
    const childFiles = [];
    const childFolders = [];
    
    if (stat.isFile()) tree.addFile(addedItem, itemPath, childFiles, childFolders, size, modifiedDate, metaData);
    else tree.addFolder(addedItem, itemPath, childFiles, childFolders, size, modifiedDate, metaData);
  }

  return tree;
};

module.exports = {
  readdirRecursive,
  readdirShallow
};