class FolderTree {
  constructor(rootName, rootIsFile = false, path='/', files = [], folders = []) {
    this.rootIsFile = rootIsFile;
    this.rootName = rootName;
    this.files = files;
    this.folders = folders;
    this.path = path;
  }

  addFile(fileName, path, files = [], folders = []) {
    this.files.push(new FolderTree(fileName, true, path, files, folders));
  }

  addFolder(folderName, path, files = [], folders = []) {
    this.folders.push(new FolderTree(folderName, false, path, files, folders));
  }
}

module.exports = FolderTree;
