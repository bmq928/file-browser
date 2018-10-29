const path = require('path')
const rootProjPath = path.join(__dirname, '..', '..')

const getFile = (filePath) => {
  if (!filePath) throw new Error('file_path is required')

  filePath = path.isAbsolute(filePath)
      ? filePath
      : path.join(rootProjPath, filePath)

  return filePath
}

module.exports = { getFile }
