const { getFile } = require('../_file-sys');

const readFile = async (filePath, options) => {
  return new Promise(async (resolve, reject) => {
    if (!filePath) return reject(new Error('file_path is required'))

    try {

      const { base64, buffer, utf8 } = await getFile(filePath, options)
      resolve({ base64, buffer, utf8 })

    } catch (error) {
      reject(error)
    }
  })
};

module.exports = {
  readFile
};