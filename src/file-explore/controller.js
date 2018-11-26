// const { readDir, pathStat, FolderTree } = require('../utils')
const { pathStat, readDir } = require('../_file-sys')
const { FolderTree } = require('../_libs')
const path = require('path')

//should try catch when use this function
//because it doesnt handle exception`
const readdirRecursive = async (dir, options) => {

  if(!dir) throw new Error('dir is required')


  const curDirectoryStat = await pathStat(dir, options)
  const tree = new FolderTree(path.basename(dir))

  if (curDirectoryStat.isFile()) {
    
    tree.addFile(dir)
    tree.rootIsFile = true
  } else if (curDirectoryStat.isDirectory()) {
    const items = await readDir(dir, options)
    console.log({items})
    //recursive
    //readir in every item in folder
    const subTrees = await Promise.all(
      items.map(item => readdirRecursive(path.join(dir, item), options))
    )

    //push to tree
    for (const subTree of subTrees) {
      if (subTree.rootIsFile) tree.addFile(subTree)
      else tree.addFolder(subTree)
    }
  }

  return tree
}

// readdirRecursive('folder', {s3:true, bucket: 'test-quang'})

//unhandle case dir is not exist
//try catch
const readdirShallow = async (dir, options) => {

  if(!dir) throw new Error('dir is required')
  const curDirectoryStat = await pathStat(dir, options)
  const rootName = path.basename(dir)

  //file
  if (curDirectoryStat.isFile()) {
    return new FolderTree(rootName)
  }

  //folder
  const items = await readDir(dir, options)
  const tree = new FolderTree(rootName, false)
  const stats = await Promise.all(items.map(i => pathStat(path.join(dir, i), options)))

  for (const i in stats) {
    const stat = stats[i]
    const addedItem = items[i]
    if (stat.isFile()) tree.addFile(addedItem)
    else tree.addFolder(addedItem)
  }

  return tree
}

module.exports = { readdirRecursive, readdirShallow }
