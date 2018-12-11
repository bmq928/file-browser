const config = require('config');

class FolderTree {
  constructor(
    rootName,
    rootIsFile = false,
    path = '/',
    files = [],
    folders = [],
    size = 0,
    modifiedDate = Date.now()
  ) {


    this.rootIsFile = rootIsFile;
    this.rootName = rootName;
    this.files = files;
    this.folders = folders;
    this.path = path;
    this.size = size;
    this.modifiedDate = modifiedDate;

    //sync path s3 and fs
    if(config.get('s3') && path.length && path[0] !== '/' ) {
      this.path = '/' + path;
    }
  }

  addFile(fileName, path, files = [], folders = [], size = 0, modifiedDate = 0) {
    this.files.push(new FolderTree(fileName, true, path, files, folders, size, modifiedDate));
  }

  addFolder(folderName, path, files = [], folders = [], size = 0, modifiedDate = 0) {
    this.folders.push(new FolderTree(folderName, false, path, files, folders, size, modifiedDate));
  }
}

module.exports = FolderTree;
