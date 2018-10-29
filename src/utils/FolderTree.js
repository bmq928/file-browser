class FolderTree {
  constructor(rootName, rootIsFile = false, files = [], folders = []) {
    this.rootIsFile = rootIsFile
    this.rootName = rootName
    this.files = files
    this.folders = folders
  }

  addFile(file) {
    this.files.push(file)
  }

  addFolder(folder) {
    this.folders.push(folder)
  }
}

module.exports = FolderTree
