class FolderTree {
  constructor(rootName, rootIsFile = false, path='/', files = [], folders = []) {
    this.rootIsFile = rootIsFile;
    this.rootName = rootName;
    this.files = files;
    this.folders = folders;
    this.path = path;
  }

  addFile(fileName, path) {
    this.files.push(new FolderTree(fileName, true, path));
  }

  addFolder(folderName, path) {
    this.folders.push(new FolderTree(folderName, false, path));
  }
}

module.exports = FolderTree;
