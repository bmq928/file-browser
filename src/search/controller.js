const { readdirShallow } = require('../file-explorer').controller

const search = async (folder, content, options) => {
  if (!folder) throw new Error('folder is required')
  if (!content) throw new Error('content is required')

  const rootNode = await readdirShallow(folder, options)
  const value = await traverseTree(rootNode, content, options)

  return value
}

const traverseTree = async (rootNode, content, options) => {
  const { files, folders } = rootNode
  let matchContent = []

  for (const f of [...files, ...folders]) {
    if (f.containMetaData(content) || f.rootName === content)
      matchContent.push(f)
  }

  const exploredFolders = await Promise.all(
    folders.map(f => readdirShallow(f.path, options))
  )

  const insideMatches = await Promise.all(
    exploredFolders.map(f => traverseTree(f, content, options))
  )

  for (const insideMatch of insideMatches) {
    matchContent = [...matchContent, ...insideMatch]
  }

  return matchContent
}

module.exports = {
  search
}