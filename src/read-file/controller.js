const config = require('config');
const rootFolderFs = config.get('rootFolder');
const { getFile, getPath } = require('../_file-sys');

const readFile = async (filePath, options) => {

  filePath = getPath(filePath, rootFolderFs, options);
  console.log({filePath})
  return new Promise(async (resolve, reject) => {
    if (!filePath) return reject(new Error('file_path is required'))

    try {

      const { base64, utf8 } = await getFile(filePath, options)
      resolve({ base64, utf8 })

    } catch (error) {
      reject(error)
    }
  })
};

module.exports = {
  readFile
};