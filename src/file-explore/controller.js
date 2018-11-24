// const { readDir, pathStat, FolderTree } = require('../utils')
const { pathStat, readDir } = require('../_file-sys')
const { FolderTree } = require('../_libs')
const path = require('path')

//should try catch when use this function
//because it doesnt handle exception`
const readdirRecursive = async dir => {
  const curDirectory = await pathStat(dir)
  const tree = new FolderTree(path.basename(dir))

  if (curDirectory.isFile()) {
    // if is file push to tree
    // tree.files.push(dir)
    tree.addFile(dir)
    tree.rootIsFile = true
  } else if (curDirectory.isDirectory()) {
    //read item in folder
    const items = await readDir(dir)

    //recursive
    //readir in every item in folder
    const subTrees = await Promise.all(
      items.map(item => readdirRecursive(path.join(dir, item)))
    )

    //push to tree
    for (const subTree of subTrees) {
      if (subTree.rootIsFile) tree.addFile(subTree)
      else tree.addFolder(subTree)
    }
  }

  return tree
}

//unhandle case dir is not exist
//try catch
const readdirShallow = async dir => {
  const curDirectory = await pathStat(dir)
  const rootName = path.basename(dir)

  //file
  if (curDirectory.isFile()) {
    return new FolderTree(rootName)
  }

  //folder
  const items = await readDir(dir)
  const tree = new FolderTree(rootName, false)
  const stats = await Promise.all(items.map(i => pathStat(path.join(dir, i))))

  for (const i in stats) {
    const stat = stats[i]
    const addedItem = items[i]
    if (stat.isFile()) tree.addFile(addedItem)
    else tree.addFolder(addedItem)
  }

  return tree
}

module.exports = { readdirRecursive, readdirShallow }
